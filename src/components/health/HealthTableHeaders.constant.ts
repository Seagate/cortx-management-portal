/*
 * CORTX-CSM: CORTX Management web.
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
 * along with this program. If not, see https://www.gnu.org/licenses/.
 * For any questions about this software or licensing,
 * please email opensource@seagate.com.
 */

const actionGroupCondition = (resoureDetails: IResource) => {
  return resoureDetails.resource === "node";
};

const startNodeCondition = (resoureDetails: IResource) => {
  return !(
    resoureDetails.status === "offline" || resoureDetails.status === "failed"
  );
};

const stopNodeCondition = (resoureDetails: IResource) => {
  return resoureDetails.status === "online";
};

const getClassName = (resoureDetails: IResource, staticClass: string) => {
  return `${staticClass}-${resoureDetails.status}`;
};

export interface IResource {
  id: string;
  last_updated_time: string;
  resource: string;
  status: string;
}

export const lrHealthConst = {
  searchConfig: {
    placeholder: "Search",
  },
  healthTable: {
    isMultiSelect: true,
    itemKey: "alert_uuid",
    headers: [
      {
        text: "Last Updated",
        value: "last_updated_time",
        type: "date",
      },
      {
        text: "Status",
        value: "status",
        type: "custom",
      },
      {
        text: "Resource",
        value: "resource",
      },
      {
        text: "Resource ID",
        value: "id",
      },
      {
        text: "",
        value: "action",
        type: "action",
        align: "start",
        sortable: false,
        zoomIcon: true,
        actionList: [],
      },
    ],
  },
  severityList: {
    online: "#6ebe49",
    offline: "#dc1f2e",
    failed: "#dc1f2e",
    degraded: "#f7a528",
    unknown: "#9e9e9e",
  },
};
