#!/usr/bin/python

"""
 ****************************************************************************
 Filename:          plugin.py
 Description:       Contains functionality for various plugins like Alerts, S3 etc.

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

from abc import ABC, ABCMeta, abstractmethod
from csm.common.comm import AmqpComm
import threading

class Plugin(metaclass=ABCMeta):
    '''
    This is an abstract class. Various plugins will implement this interface i.e. SSPL plugin, S3 plugin etc.
    '''
    @abstractmethod
    def init(self):
        raise Exception('init not implemented for Plugin class')

    def execute(self, **kwargs):
        '''
        This method will handle GET/POST calls. 
        '''
        raise Exception('execute not implemented for Plugin class')

    def consume(self):
        '''
        This method will be used as a thread function.
        '''
        raise Exception('consume not implemented for Plugin class')

class Alert(Plugin):
    def __init__(self):
        Plugin.__init__(self)
        self.amqp_client = AmqpComm()
        self.alert_callback = None

    def init(self):
        '''
        Establish connection with the RMQ Server.
        '''
        self.amqp_client.init()

    def start(self, callback_fn):
        '''
        This method will start the alert plugin in a thread.
        Alert's consume method acts as the thread function.
        Parameters -
        1. callback_fn :- This parameter specifies the name CSM Core's function to which plugin
           will send the alerts as JSON string.  
        '''
        self.alert_callback = callback_fn
        Alert.run_thread(self.consume, ())

    def execute(self, **kwargs):
        raise Exception('execute not implemented for Alerts class')

    def _amqp_callback(self, ch, method, properties, body):
        '''
        1. This is the callback method on which we will receive the alerts from RMQ channel.
        2. This method will call CSM Core's method and will send the alert JSON string as parameter.
        3. Upon receiving the status(i.e True) we will then acknowledge the alert.
        Parameters -
        1. ch - RMQ Channel
        2. method - Contains the server-assigned delivery tag
        3. properties - Contains basic properties like delivery_mode etc. 
        4. body - Actual alert JSON string
        '''
        if self.alert_callback:
            status = self.alert_callback(body)
            if status == True:
                #Acknowledge the alert so that it could be removed from the queue
                ch.basic_ack(delivery_tag=method.delivery_tag)

    def consume(self):
        '''
        This method registers the callback with basic_consume method and starts consuming the alerts.
        '''
        self.amqp_client.recv(self._amqp_callback)
        self.amqp_client.listen()

    @staticmethod
    def run_thread(func, args):
        '''
        This method will create and start the thread . 
        '''
        amqp_thread = threading.Thread(target=func, args=args)
        amqp_thread.start()
