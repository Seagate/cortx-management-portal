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
import json

class AlertPlugin(CsmPlugin):
    """
    Alert Plugin is responsible for listening on the comm channel and receive
    alerts. It has a callback which is called to send the received alerts. 
    Note, Alert Plugin needs to be called in thread context as it blocks while
    listening for the alerts.
    """

    def __init__(self):
        CsmPlugin.__init__(self)
        self.comm_client = AmqpComm()
        self.monitor_callback = None

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
            alert_message = self._convert_to_csm_schema(message)
            status = self.monitor_callback(alert_message)
            if status == True:
                """
                Acknowledge the alert so that it could be removed from the
                queue. 
                """
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
        msg_body = json.loads(message)
        data = {'$schema': 'http://json-schema.org/draft-03/schema#', 'id':\
                'http://json-schema.org/draft-03/schema#', 'title':\
                'CSM HW Schema', 'type': 'object', 'properties':\
                {'header': {}, 'hw': {}}}
        
        dict = msg_body['message']['sensor_response_type']
        for values in dict.values():
            data['properties']['header'] = {'type': 'hw', 'alert_type': '%s'\
                    %(values.get('alert_type', "")), 'type': 'hw', 'status':\
                    '%s' %(values.get('info', {}).get('status', '')),\
                    'resolved': 'no', 'acknowledged': 'no', 'description':\
                    '%s' %(values.get('info', {}).get('health-reason', '')),\
                     'location': '%s' %(values.get('info', {}).get('location',\
                     '')), 'severity': '1', 'recommendation': '%s'\
                     %(values.get('info', {}).get('health-recommendation', ''))}
            data['properties']['hw'] = {'vendor': '%s' %(values.get('info', {})\
                    .get('vendor', '')), 'enclosure_id': '%s'\
                    %(values.get('info', {}).get('enclosure-id', '')), \
                    'serial_number': '%s' %(values.get('info', {})\
                    .get('serial-number', '')), 'part_number': '%s'\
                    %(values.get('info', {}).get('part-number', ''))}
        return data
