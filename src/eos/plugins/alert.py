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
from csm.common.comm import AmqpComm
from csm.common.errors import CsmError
from csm.common.log import Log
from csm.common.payload import Payload, Json, JsonMessage, Dict
from csm.common.plugin import CsmPlugin
from csm.core.blogic import const
from marshmallow import Schema, fields, ValidationError

class AlertSchemaValidator(Schema):
    """
    AlertSchemaValidator for validating the schema using marshmallow for AlertPlugin.
    """
    alert_uuid = fields.String(required=True,
                               description="uuid to identify an  alert.")
    sensor_info = fields.String(required=True,
                                description="unique key to identify hardware."
                                            "Combination of site_id,node_id,rack_id,"
                                            "resource_id,cluster_id")
    state = fields.String(required=True,
                          description="State of the alert "
                                      "(e.g. missing| insertion etc.)")
    created_time = fields.Integer(required=True,
                                  description="Origination time of the alert")
    updated_time = fields.Integer(required=False,
                                  description="Updation time of the alert")
    resolved = fields.Boolean(required=False,
                              description="Resolution status of an alert."
                                          " (e.g. True | False)")
    acknowledged = fields.Boolean(required=False,
                                  description="Alert is acknowldeged by the user or not."
                                              "(e.g. True | False)")
    severity = fields.String(required=True,
                             description="Severity of an alert.(e.g. TBD")
    module_type = fields.String(required=False,
                                description="Type of the module. (e.g. PSU, FAN)")
    module_name = fields.String(required=False,
                                description="Name of the module. (e.g. Fan Module 4)")
    description = fields.String(required=False, allow_none=True,
                                description="This is the id from which a "
                                            "description will be fetched (e.g. TBD)")
    health = fields.String(required=False, allow_none=True,
                           description="Describes the health of PSU, \
                                   Controller, Disk etc.")
    health_recommendation = fields.String(required=False, allow_none=True,
                                          description="This is the health \
                                                  recommendation string.")
    extended_info = fields.String(required=False, description="Extended Info")
    event_details = fields.String(required = False, \
            description = "Specific fields to display.")
    name = fields.String(required = False, allow_none = True, description = \
            "Name for specific modules.")
    serial_number = fields.String(required = False, allow_none = True, \
            description = "Serial number of the resource.")
    volume_group = fields.String(required = False, allow_none = True, \
                        description = "Disk volume group.")
    volume_size = fields.String(required = False, allow_none = True, \
                        description = "Disk size.")
    volume_total_size = fields.String(required = False, allow_none = True, \
                        description = "Disk total size.")
    version = fields.String(required = False, allow_none = True, \
                        description = "Version information for resources.")
    location = fields.String(required = False, allow_none = True, \
                        description = "Location of the resources.")
    disk_slot = fields.Integer(required=False, allow_none = True, \
            description="Slot number of the disk.")
    durable_id = fields.String(required=False, description="Durable Id")

class AlertPlugin(CsmPlugin):
    """
    Alert Plugin is responsible for listening on the comm channel and receive
    alerts. It has a callback which is called to send the received alerts. 
    Note, Alert Plugin needs to be called in thread context as it blocks while
    listening for the alerts.
    """

    def __init__(self):
        super().__init__()
        try:
            self.comm_client = AmqpComm()
            self.monitor_callback = None
            self.mapping_dict = Json(const.ALERT_MAPPING_TABLE).load()
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
        Validations performed:
        1. Validated without resource-type
        2. Validating with wrong resource type as per mapping dict.
        3. Validating with wrong data type in schema.
        4. Validating empty alert data.
        5. Validating with all appropriate data.
        """
        if self.monitor_callback:
            try:
                alert = self._convert_to_csm_schema(message)
                """Validating Schema using marshmallow"""
                alert_validator = AlertSchemaValidator()
                alert_data = alert_validator.load(alert, unknown='EXCLUDE')
                status = self.monitor_callback(alert_data)
                if status:
                    # Acknowledge the alert so that it could be
                    # removed from the queue.
                    self.comm_client.acknowledge()
            except ValidationError as ve:
                # Acknowledge incase of validation error.
                Log.exception(ve)
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
                """ Convert  the SSPL Schema to CSM Schema. """
                input_alert_payload = Payload(JsonMessage(message))
                csm_alert_payload = Payload(Dict(dict()))
                input_alert_payload.convert(self.mapping_dict.get(module_type, {}),
                                            csm_alert_payload)
                csm_alert_payload.dump()
                csm_schema = csm_alert_payload.load()
                # TODO
                """
                1. Currently we are not consuming alert_type so keeping the 
                placeholder for now.
                2. alert_type should be derived from SSPL message's
                info.resource_type field
                3. Once a requirement comes for consuming alert_type, we should
                make use of info.resource_type and derive the alert type. 
                csm_schema[const.ALERT_TYPE] = const.HW 
                """

                """
                Below mentioned fields are managed by CSM so they are not the part
                of mapping table
                """
                csm_schema[const.ALERT_MODULE_TYPE] = f'{module_type}'
                csm_schema[const.ALERT_MODULE_NAME] = resource_type
                csm_schema[const.ALERT_CREATED_TIME] = \
                    int(csm_schema[const.ALERT_CREATED_TIME])
                csm_schema[const.ALERT_UPDATED_TIME] = int(time.time())
                csm_schema[const.ALERT_RESOLVED] = False
                csm_schema[const.ALERT_ACKNOWLEDGED] = False
                csm_schema[const.ALERT_COMMENT] = ""
                """
                1. Event Details field is of type List and will conatin array of
                specific info dictionary. 
                2. Not all the fields from SSPL's specific info is consumed.
                3. Only those values are consumed which we need to display on the
                new Alert details UI page.
                4. Sensor Info is of type string and contains the concatinated
                values of site_id, node_id, rack_id, cluster_id and resource_id
                from SSPL's info section of the alert message.
                5. This string uniquely identifies the resource for which an
                alert has come.
                """
                csm_schema[const.ALERT_SENSOR_INFO] = \
                    '_'.join(str(x) for x in csm_schema[const.ALERT_SENSOR_INFO].values())
                csm_schema[const.ALERT_SENSOR_INFO] = \
                    csm_schema[const.ALERT_SENSOR_INFO].replace(" ", "_")
                if const.ALERT_EVENTS in csm_schema and \
                        csm_schema[const.ALERT_EVENTS] is not None:
                    csm_schema[const.ALERT_EVENT_DETAILS] = []
                    self._prepare_specific_info(csm_schema)
                    csm_schema.pop(const.ALERT_EVENTS)
                    csm_schema[const.ALERT_EVENT_DETAILS] = \
                            str(csm_schema[const.ALERT_EVENT_DETAILS])
                csm_schema[const.ALERT_EXTENDED_INFO] = \
                        str(csm_schema[const.ALERT_EXTENDED_INFO])
        except Exception as e:
            Log.exception(e)
            raise CsmError(-1, '%s' % e)
        return csm_schema

    def _prepare_specific_info(self, csm_schema):
        """
        This method prepares event_details for all the alerts. event_details
        comprises of some specific fields for each resource type like
        health-reason, health-recommendation and other specific fields.
        :param csm_schema : Dict containing csm alert message format
        :return : None
        """
        if csm_schema[const.ALERT_MODULE_TYPE] in (const.ALERT_LOGICAL_VOLUME,
                                                   const.ALERT_VOLUME,
                                                   const.ALERT_SIDEPLANE,
                                                   const.ALERT_FAN):
            for items in csm_schema[const.ALERT_EVENTS]:
                description_dict = {}
                """
                1. For logical_volume, volume, sideplane and fan we get a list of
                dictionaries conayining name, health-reason and
                health-recommendaion.
                2. For Sideplane expander we do not get name as a key instead we
                get component-id.
                """
                if const.ALERT_NAME in items:
                    description_dict[const.ALERT_NAME] = items[const.ALERT_NAME]
                elif const.ALERT_COMPONENET_ID in items:
                    description_dict[const.ALERT_NAME] = \
                        items[const.ALERT_COMPONENET_ID]
                description_dict[const.ALERT_EVENT_REASON] = \
                    items[const.ALERT_HEALTH_REASON]
                description_dict[const.ALERT_EVENT_RECOMMENDATION] = \
                    items[const.ALERT_HEALTH_RECOMMENDATION]
                csm_schema[const.ALERT_EVENT_DETAILS].append(description_dict)
