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

from csm.common.comm import AmqpComm
from csm.common.plugin import CsmPlugin 
from csm.common.errors import CsmError
from csm.common.log import Log
from csm.core.blogic import const
import errno
import json, os
from jsonschema import Draft3Validator
from jsonschema import validate
import time
from csm.common.schema import *

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
        self.schema_obj = Schema()
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
            if key  == const.CSM_ALERT_CMD and \
                    value.strip() == 'listen':
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
                if status == True:
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
        csm_schema = dict()
        try:
            if not isinstance(message, dict):
                msg_body = json.loads(message)
            else:
                msg_body = message
            """
            Since the mappings in the mapping table is divided as per the 
            module type i.e. fan, disk etc so we first need to fetch this value
            from resource_type. As resource_type contains this information.
            i.e. "resource_type": "encl:fru:disk"
            """
            sub_body = msg_body.get(const.ALERT_MESSAGE, {})\
                    .get(const.ALERT_SENSOR_TYPE, {})
            resource_type = {}
            for key in sub_body:
                resource_type = sub_body[key].get(const.ALERT_RESOURCE_TYPE, "")
            module_type = resource_type.split(':')[2]
            serialized_csm_schema = {}
            serialized_input_schema = {}
            """
            Serializing the incoming alert. i.e message.sensor_response_type.xxx
            """
            serialized_input_schema = self.schema_obj.serialize(msg_body)
            """
            Once the input schema is seralized we will now map the input
            schema to output schema based on a mapping table.
            """
            serialized_csm_schema = self.schema_obj.map_schema(module_type,
                    serialized_input_schema)
            """
            Once the data is mapped to csm schema its now time to deserialize it
            """
            csm_schema = self.schema_obj.deserialize(serialized_csm_schema)
            """
            For now setting the created_time to current epoch.
            Once SSPL starts sending the time in epoch we will make
            use of 'time' field.
            Currently type is not populated, so we are taking a hardcoded
            value for this.
            The below 3 fields needs to be put into mapping table once we 
            receive the updated json from SSPL.
            """
            #TODO
            csm_schema[const.ALERT_CREATED_TIME] = int(time.time())
            csm_schema[const.ALERT_TYPE] = 'hw'
            csm_schema[const.ALERT_UUID] = int(csm_schema.get(const.ALERT_ENCLOSURE_ID,\
                const.ALERT_INT_DEFAULT))
            """
            Below mentioned fields are managed by CSM so they are not the part
            of mapping table
            """
            csm_schema[const.ALERT_ID] = int(time.time())
            csm_schema[const.ALERT_MODULE_TYPE] = '{}'.format(module_type)
            csm_schema[const.ALERT_MODULE_NAME] = '{}'.format(
                    resource_type.split(':', 1)[1])
            csm_schema[const.ALERT_UPDATED_TIME] = int(time.time())
            csm_schema[const.ALERT_RESOLVED] = const.ALERT_FALSE
            csm_schema[const.ALERT_ACKNOWLEDGED] = const.ALERT_FALSE
            csm_schema[const.ALERT_SEVERITY] = const.ALERT_TRUE
            """ Validating the schema. """
            validate(csm_schema, self._hw_schema)
        except Exception as e:
            Log.exception(e)
        return csm_schema
