/*
* CORTX-CSM: CORTX Management web and CLI interface.
* Copyright (c) 2022 Seagate Technology LLC and/or its Affiliates
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
export const lrS3AccountConst = {
    s3AccessTable: {
        isMultiSelect: false,
        itemKey: "access_key_id",
        headers: [
            { text: "Access Key", value: "access_key_id", sortable: false },
            { text: "Last update", value: "updated_time", type: "date", sortable: false },
            { text: "Status", value: "status", sortable: false, type: "custom" },
            {
                text: "",
                value: "action",
                type: "action",
                align: "end",
                sortable: false,
                zoomIcon: false,
                actionList: ["delete"]
            }
        ],
        headerButton: {
            name: "generate",
            label: "Generate",
            disabled: false
        }
    }
}

export const IAMUserConst = {
    searchConfig: {
        placeholder: "Search",
        advanceForm: [
            {
                type: "textbox",
                name: "user_id",
                label: "User id",
                placeholder: "Enter user id",
                value: ""
            },
            {
                type: "textbox",
                name: "user_name",
                label: "User name",
                placeholder: "Enter user name",
                value: ""
            }
        ]
    },
    s3IAMUserTable: {
        isMultiSelect: false,
        itemKey: "user_name",
        headers: [
            { text: "User name", value: "user_name" },
            { text: "User id", value: "user_id" },
            { text: "ARN", value: "arn" },
            {
                text: "",
                value: "action",
                type: "action",
                align: "end",
                sortable: false,
                zoomIcon: false,
                actionList: ["edit", "delete"]
            }
        ],
        headerButton: {
            name: "create",
            label: "Create",
        }
    },
    tableConfig: {
        pagination: {
            pageSize: 5,
            totalRecords: 5,
            currentPage: 1
        },
        filterList: [],
        sort: null
    },
}

export const LrBucketConst = {
    bucketTable: {
        isMultiSelect: false,
        itemKey: "name",
        headers: [
            { text: "Name", value: "name", sortable: false },
            {
                text: "",
                value: "action",
                type: "action",
                align: "end",
                sortable: false,
                zoomIcon: false,
                actionList: ["edit", "delete"]
            }
        ],
        headerButton: {
            name: "create",
            label: "Create"
        }
    }
}
