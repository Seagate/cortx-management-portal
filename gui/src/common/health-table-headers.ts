/*
* CORTX-CSM: CORTX Management web and CLI interface.
* Copyright (c) 2020 Seagate Technology LLC and/or its Affiliates
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as published
* by the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
* GNU Affero General Public License for more details.
* You should have received a copy of the GNU Affero General Public License
* along with this program. If not, see <https://www.gnu.org/licenses/>.
* For any questions about this software or licensing,
* please email opensource@seagate.com or cortx-questions@seagate.com.
*/

const startNodeCondition = (status: string) => {
  debugger;
  return status !== "online"
}

const stopNodeCondition = (status: string) => {
  return status === "online"
}

export const healthTableHeaders = {
    healthTableHeaderList: [
        {
          "field_id": "resource",
          "label": "Resource",
          "display_id": 201,
          "sortable": false,
          "filterable": false,
          "display": true,
          "value": {
            "type": "text"
            }
        },
        {
          "field_id": "id",
          "label": "Resource ID",
          "display_id": 201,
          "sortable": false,
          "filterable": false,
          "display": true,
          "value": {
            "type": "text"
            }
        },
        {
          "field_id": "status",
          "label": "Status",
          "display_id": 201,
          "sortable": false,
          "filterable": false,
          "display": true,
          "value": {
            "type": "image",
            "mapValueToClassName": {
                "online": "cortx-cluster-status cortx-status-online",
                "offline": "cortx-cluster-status cortx-status-offline",
                "failed": "cortx-cluster-status cortx-status-failed",
                "degraded": "cortx-cluster-status cortx-status-degraded",
                "unknown": "cortx-cluster-status cortx-status-unknown"
              }
          }
        },
        {
          "field_id": "last_updated_time",
          "label": "Last Updated",
          "display_id": 201,
          "sortable": false,
          "filterable": false,
          "display": true,
          "value": {
            "type": "date"
            }
        },
        {
          "field_id": "action_buttons",
          "label": "Actions",
          "display_id": 1001,
          "sortable": false,
          "filterable": false,
          "actionDetails": [
            {
              "id": "getMoreInfoAction",
              "iconClass": "cortx-zoom-icon",
              "tooltip": "Show more details",
            }
          ],
          "actionGroup": [
            {
              "id": "startNodeAction",
              "iconClass": "cortx-start-node-icon",
              "label": "Start Node",
              "condition": startNodeCondition
            },
            {
              "id": "stopNodeAction",
              "iconClass": "cortx-stop-node-icon",
              "label": "Stop Node",
              "condition": stopNodeCondition
            },
            {
              "id": "powerOffAction",
              "iconClass": "cortx-power-off-node-icon",
              "label": "Power off"
            },
            {
              "id": "powerAndStorageOffAction",
              "iconClass": "cortx-power-storage-off-node-icon",
              "label": "Power and Storage off"
            },
          ],
          "display": true,
          "value": { "type": "buttons" }
        }
    ]
}