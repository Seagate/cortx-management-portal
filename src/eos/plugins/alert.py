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

    def _prepare_common_details(self, body):
        """
        This method fetches the values from SSPL schema and then
        creates a CSM schema containing common values i.e status, 
        health, location etc.
        """
        data = dict()
        data[const.ALERT_ID] = int(time.time())
        data[const.ALERT_UUID] = int((body.get(const.IN_ALERT_ENCLOSURE_ID,\
                const.ALERT_INT_DEFAULT)))
        data[const.ALERT_STATUS] = '{}'.format(body.get(const.ALERT_STATUS, ""))
        data[const.ALERT_TYPE] = const.ALERT_HW 
        data[const.ALERT_ENCLOSURE_ID] = int(body.get\
                (const.IN_ALERT_ENCLOSURE_ID, const.ALERT_INT_DEFAULT))
        data[const.ALERT_MODULE_NAME] = '{}'.format(body.get\
                (const.ALERT_MODULE_NAME, ""))
        data[const.ALERT_DESCRIPTION] = '{}'.format(body.get\
                (const.ALERT_HEALTH_REASON, ""))
        data[const.ALERT_HEALTH] = '{}'.format(body.get(const.ALERT_HEALTH, ""))
        data[const.ALERT_HEALTH_RECOMMENDATION] = '{}'.format\
                (body.get(const.IN_ALERT_HEALTH_RECOMMENDATION, ""))
        data[const.ALERT_LOCATION] = '{}'.format(body.get\
                (const.ALERT_LOCATION, ""))
        data[const.ALERT_RESOLVED] = const.ALERT_FALSE
        data[const.ALERT_ACKNOWLEDGED] = const.ALERT_FALSE
        data[const.ALERT_SEVERITY] = const.ALERT_TRUE
        return data

    def _prepare_csm_schema(self, body, key):
        """
        This method first collects the common details and then creates
        an extended info containg all the fields from extended_info and 
        info dictionaries. 
        """
        data = {}
        details = {}
        try:
            """
            For Fan related alerts the common fiels resides under
            info.fan_module. For all the other alerts it resides under
            info.
            """
            if key == const.FAN_ALERT:
                details = body[key][const.ALERT_INFO][const.ALERT_FAN_MODULE]
            else:
                details = body[key][const.ALERT_INFO]
            """ Fetching the common values for CSM schema. """
            data = self._prepare_common_details(details)
            data[const.ALERT_STATE] = '{}'.format(body[key].get\
                    ('alert_type', ""))
            """ Fetching values from extended_info. """
            extended_info = body[key][const.ALERT_EXTENDED_INFO]
            """
            Creating extended_info for CSM schema. This extended_info will
            contain all the remaining fields other then the common one. 
            The fields for extended_info is fetched from extended_info and
            info dictionaries of SSPL schema.
            """
            data[const.ALERT_EXTENDED_INFO] = {const.ALERT_RESOURCE_TYPE: "",\
                    const.ALERT_OTHER_DETAILS: {}}
            data[const.ALERT_EXTENDED_INFO][const.ALERT_RESOURCE_TYPE] =\
                    '{}'.format(body[key].get(const.ALERT_RESOURCE_TYPE, ""))
            for info in extended_info:
                data[const.ALERT_EXTENDED_INFO][info] = extended_info[info]
            """
            Removing the already added fields from the dictionary so that 
            the remaining fields fron info can be directly copied into
            extended_info of CSM schema.
            """
            details.pop(const.ALERT_STATUS, "")
            details.pop(const.IN_ALERT_ENCLOSURE_ID, const.ALERT_INT_DEFAULT)
            details.pop(const.ALERT_MODULE_NAME, "")
            details.pop(const.ALERT_HEALTH_REASON, "")
            details.pop(const.ALERT_HEALTH, "")
            details.pop(const.IN_ALERT_HEALTH_RECOMMENDATION, "")
            details.pop(const.ALERT_LOCATION, "")
            """
            Created other_fields key inside extended_info which will contain the
            remaining fields.
            """
            data[const.ALERT_EXTENDED_INFO][const.ALERT_OTHER_DETAILS] = details
            module_type = key.split('_')
            data[const.ALERT_MODULE_TYPE] = '{}'.format(module_type[1])
            data[const.ALERT_UPDATED_TIME] = int(time.time())
        except KeyError as e:
            Log.exception(e)
        return data

    def _convert_to_csm_schema(self, message):
        """ 
        Parsing the alert JSON to create the csm schema
        """
        try:
            if not isinstance(message, dict):
                msg_body = json.loads(message)
            else:
                msg_body = message
            body = msg_body['message']['sensor_response_type']
            csm_schema = {}
            for key in body:
                csm_schema = self._prepare_csm_schema(body, key)
            """
            For now setting the created_time to current epoch.
            Once SSPL starts sending the time in epoch we will make
            use of 'time' field
            """
            csm_schema[const.ALERT_CREATED_TIME] = int(time.time())
            """ Validating the schema. """
            validate(csm_schema, self._hw_schema)
        except Exception as e:
            Log.exception(e)
        return csm_schema
