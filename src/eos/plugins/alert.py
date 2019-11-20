#!/usr/bin/env python3

"""
 ****************************************************************************
 Filename:          alert.py
 Description:       Contains functionality for alert plugin.

 Creation Date:     09/08/2019
 Author:            Pawan Kumar Srivastava

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 ****************************************************************************
"""

import json
import os
import time
from csm.common.payload import Payload, Json, JsonMessage, Dict
from csm.common.comm import AmqpComm
from csm.common.log import Log
from csm.common.plugin import CsmPlugin
from csm.core.blogic import const
from jsonschema import Draft3Validator
from jsonschema import validate
from csm.common.errors import CsmError

class AlertPlugin(CsmPlugin):
    """
    Alert Plugin is responsible for listening on the comm channel and receive
    alerts. It has a callback which is called to send the received alerts. 
    Note, Alert Plugin needs to be called in thread context as it blocks while
    listening for the alerts.
    """

    def __init__(self):
        super().__init__()
        self.comm_client = AmqpComm()
        self.monitor_callback = None
        self.mapping_dict = Json(const.ALERT_MAPPING_TABLE).load()
        self._schema = ""
        self._hw_schema = {}
        try:
            """ Validating the CSM Schema with Draft3Validator """
            if os.path.isfile(const.CSM_HW_SCHEMA):
                with open(const.CSM_HW_SCHEMA, 'r') as hw_file:
                    self._schema = hw_file.read()
                """ Remove tabs and newlines """
                self._hw_schema = json.loads(' '.join(self._schema.split()))
                """ Validate the schema """
                Draft3Validator.check_schema(self._hw_schema)
        except Exception as e:
            Log.exception(e)

    def init(self, callback_fn):
        """
        Establish connection with the RMQ Server.
        AlertPlugin's _listen method acts as the thread function.
        Parameters -
        1. callback_fn :- This parameter specifies the name AlertMonitor 
           class function to which plugin will send the alerts as JSON string.  
        """
        self.monitor_callback = callback_fn
        self.comm_client.init()

    def process_request(self, **kwargs):
        for key, value in kwargs.items():
            if key == const.CSM_ALERT_CMD and value.strip() == 'listen':
                self._listen()

    def _plugin_callback(self, message):
        """
        1. This is the callback method on which we will receive the 
           alerts from Comm class.
        2. This method will call AlertMonitor class function and will 
           send the alert JSON string as parameter.
        3. Upon receiving the status(i.e True) we will then acknowledge the
           alert.
        Parameters -
        1. body - Actual alert JSON string
        """
        if self.monitor_callback:
            try:
                alert = self._convert_to_csm_schema(message)
                status = self.monitor_callback(alert)
                if status:
                    # Acknowledge the alert so that it could be
                    # removed from the queue.
                    self.comm_client.acknowledge()
            except Exception as e:
                Log.exception(e)
                # Silently acknowledge ill-formed CSM alerts
                self.comm_client.acknowledge()

    def _listen(self):
        """
        This is thread function.
        This method registers the callback with basic_consume method 
        and starts consuming the alerts.
        """
        try:
            self.comm_client.recv(self._plugin_callback)
        except Exception as e:
            Log.exception(e)

    def stop(self):
        """
        This method will call comm's stop to stop consuming from the queue.
        """
        self.comm_client.stop()

    def _convert_to_csm_schema(self, message):
        """ 
        Parsing the alert JSON to create the csm schema
        """
        csm_schema = {}
        try:
            json_msg_obj = JsonMessage(message)
            msg_body = json_msg_obj.load()
            sub_body = msg_body.get(const.ALERT_MESSAGE, {}).get(
                const.ALERT_SENSOR_TYPE, {})
            resource_type = sub_body.get("info", {}).get(const.ALERT_RESOURCE_TYPE,
                                                      "")
            if resource_type:
                module_type = resource_type.split(':')[2]
                # Convert  the SSPL Schema to CSM Schema.
                input_alert_payload = Payload(JsonMessage(message))
                csm_alert_payload = Payload(Dict())
                input_alert_payload.convert(self.mapping_dict.get(module_type, {}),
                                        csm_alert_payload)
                csm_alert_payload.dump()
                csm_schema = csm_alert_payload.load()
                csm_schema[const.ALERT_TYPE] = const.HW 
                """
                # Below mentioned fields are managed by CSM so they are not the part
                # of mapping table
                """
                csm_schema[const.ALERT_MODULE_TYPE] = f'{module_type}'
                csm_schema[const.ALERT_MODULE_NAME] = resource_type
                csm_schema[const.ALERT_CREATED_TIME] =\
                        int(csm_schema[const.ALERT_CREATED_TIME])
                csm_schema[const.ALERT_UPDATED_TIME] = int(time.time())
                csm_schema[const.ALERT_RESOLVED] = False 
                csm_schema[const.ALERT_ACKNOWLEDGED] = False
                csm_schema[const.ALERT_COMMENT] = ""
                csm_schema[const.ALERT_HW_IDENTIFIER] = \
                        csm_schema[const.ALERT_HW_IDENTIFIER].replace(" ", "_")
                """ Validating the schema. """
                validate(csm_schema, self._hw_schema)
            else:
                Log.error("No resource type found for alert - {%s}" %(message))
                raise CsmError(-1, 'No resource type found for alert.')
        except Exception as e:
            Log.exception(e)
            raise CsmError(-1, '%s' %e)
        return csm_schema
