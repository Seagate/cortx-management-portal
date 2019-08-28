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
from enum import Enum
import datetime

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
        data = {'id': int((body.get('enclosure-id', -1)))\
                , 'alert_uuid': int((body.get('enclosure-id', -1))),\
                'status': '%s' %(body.get('status', "")), 'type': 'hw',\
                'enclosure_id': int(body.get('enclosure-id', -1)),\
                'module_name': '%s' %((body.get\
                ('name', ""))), 'description': '%s' %(body.get\
                ('health-reason', "")), 'health': '%s' %(body.get\
                ('health', "")), 'health_recommendation': '%s' %\
                ((body.get('health-recommendation', ""))), 'location':\
                '%s' %((body.get('location', ""))), 'resolved': 0,\
                'acknowledged': 0, 'severity': 1}
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
                details = body[key]['info']['fan_module']
            else:
                details = body[key]['info']
            """ Fetching the common values for CSM schema. """
            data = self._prepare_common_details(details)
            data.update({'state': '%s' %(body[key].get('alert_type', ""))})
            """ Fetching values from extended_info. """
            extended_info = body[key]['extended_info']
            """
            Creating extended_info for CSM schema. This extended_info will
            contain all the remaining fields other then the common one. 
            The fields for extended_info is fetched from extended_info and
            info dictionaries of SSPL schema.
            """
            data['extended_info'] = {'resource_type': '%s'\
                %(body[key].get('resource_type', ""))}
            for info in extended_info:
                data['extended_info'].update({'%s' %(info):\
                        extended_info[info]})
            """
            Removing the already added fields from the dictionary so that 
            the remaining fields fron info can be directly copied into
            extended_info of CSM schema.
            """
            details.pop('status', "")
            details.pop('enclosure-id', -1)
            details.pop('name', "")
            details.pop('health-reason', "")
            details.pop('health', "")
            details.pop('health-recommendation', "")
            details.pop('location', "")
            """
            Created other_fields key inside extended_info which will contain the
            remaining fields.
            """
            data['extended_info'].update({'other_details': details})
            module_type = key.split('_')
            data.update({'module_type': '%s' %(module_type[1])})
            data.update({'updated_time': '%s' %(datetime.datetime.utcnow())})
        except KeyError as e:
            Log.exception(e)
        return data

    def _convert_to_csm_schema(self, message):
        """ 
        Parsing the alert JSON to create the csm schema
        """
        if isinstance(message, dict) == False:
            msg_body = json.loads(message)
        else:
            msg_body = message
        body = msg_body['message']['sensor_response_type']
        csm_schema = {}
        for key in body:
            csm_schema = self._prepare_csm_schema(body, key)
            csm_schema.update({'created_time': '%s' %\
                    (msg_body.get('time', ""))})
        return csm_schema
