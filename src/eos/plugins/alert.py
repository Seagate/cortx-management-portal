from csm.common.comm import AmqpComm
from csm.eos.plugins.plugin import Plugin 
import threading

class Alerts(Plugin):
    def __init__(self):
        Plugin.__init__(self)
        self.amqp_client = AmqpComm()
        self.monitor_callback = None

    def init(self, callback_fn):
        '''
        Establish connection with the RMQ Server.
        Alert's consume method acts as the thread function.
        Parameters -
        1. callback_fn :- This parameter specifies the name AlertMonitor class function to which plugin
           will send the alerts as JSON string.  
        '''
        self.monitor_callback = callback_fn
        self.amqp_client.init()
        amqp_thread = threading.Thread(target=self.consume, args=())
        amqp_thread.start()

    def process_request(self, **kwargs):
        raise Exception('process_request not implemented for Alerts class')

    def _alert_callback(self, ct, ch, method, properties, body):
        '''
        1. This is the callback method on which we will receive the alerts from RMQ channel.
        2. This method will call AlertMonitor class function and will send the alert JSON string as parameter.
        3. Upon receiving the status(i.e True) we will then acknowledge the alert.
        Parameters -
        1. ch - RMQ Channel
        2. method - Contains the server-assigned delivery tag
        3. properties - Contains basic properties like delivery_mode etc. 
        4. body - Actual alert JSON string
        '''
        if self.monitor_callback:
            status = self.monitor_callback(body)
            if status == True:
                #Acknowledge the alert so that it could be removed from the queue
                ch.basic_ack(delivery_tag=method.delivery_tag)

    def consume(self):
        '''
        This is thread function.
        This method registers the callback with basic_consume method and starts consuming the alerts.
        '''
        self.amqp_client.recv(self._alert_callback)
