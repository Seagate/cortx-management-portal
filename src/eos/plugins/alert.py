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
from csm.eos.plugins.plugin import CsmPlugin 
from csm.common.errors import CsmError
from csm.common.log import Log
import threading
import errno

class AlertPlugin(CsmPlugin):
    def __init__(self):
        CsmPlugin.__init__(self)
        self.comm_client = AmqpComm()
        self.monitor_callback = None

    def init(self, callback_fn):
        """
        Establish connection with the RMQ Server.
        AlertPlugin's consume method acts as the thread function.
        Parameters -
        1. callback_fn :- This parameter specifies the name AlertMonitor 
           class function to which plugin will send the alerts as JSON string.  
        """
        self.monitor_callback = callback_fn
        self.comm_client.init()
        alert_thread = threading.Thread(target=self.consume, args=())
        alert_thread.start()

    def process_request(self, **kwargs):
        raise CsmError(errno.ENOSYS, 'AlertPlugin::process_request is not implemented') 

    def plugin_callback(self, message):
        """
        1. This is the callback method on which we will receive the 
           alerts from Comm class.
        2. This method will call AlertMonitor class function and will 
           send the alert JSON string as parameter.
        3. Upon receiving the status(i.e True) we will then acknowledge the alert.
        Parameters -
        1. body - Actual alert JSON string
        """
        if self.monitor_callback:
            status = self.monitor_callback(message)
            if status == True:
                #Acknowledge the alert so that it could be removed from the queue
                self.comm_client.acknowledge()

    def consume(self):
        """
        This is thread function.
        This method registers the callback with basic_consume method 
        and starts consuming the alerts.
        """
        try:
            self.comm_client.recv(self.plugin_callback)
        except Exception as e:
            Log.exception(e)

    def stop(self):
        self.comm_client.stop()
