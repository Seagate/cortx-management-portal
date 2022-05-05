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

export const lrMaintenanceCardsConst = {
  cardList: [
    {
      name: "cluster_maintenance",
      title: "Cluster Maintenance",
      description: "Lorem ipsum, or lipsum as it is sometimes known.",
      icon: "cluster-green.svg",
    },
    {
      name: "update_software",
      title: "Update Software",
      description: "Lorem ipsum, or lipsum as it is sometimes known.",
      icon: "update.svg",
    },
    {
      name: "support_bundle",
      title: "Support Bundle",
      description: "Lorem ipsum, or lipsum as it is some known.",
      icon: "support-bundle.svg",
    },
  ],
};

export const lrMaintenanceSupportBundleConst = {
  searchConfig: {
    placeholder: "Search",
    advanceForm: [
      {
        type: "textbox",
        name: "bundleId",
        label: "Bundle Id",
        placeholder: "Bundle Id",
        value: "",
      },
      {
        type: "textbox",
        name: "status",
        label: "Status",
        placeholder: "Status",
        value: "",
      },
    ],
  },
  supportBundleTable: {
    headers: [
      {
        text: "Bundle Id",
        value: "bundleId",
      },
      {
        text: "Timestamp",
        value: "timestamp",
        type: "date",
      },
      {
        text: "Status",
        value: "status",
      },
      {
        text: "",
        value: "action",
        type: "action",
        align: "end",
        sortable: false,
        zoomIcon: true,
        actionList: [],
        customActionList: [
          {
            name: "download",
            path: "download.svg",
            hoverPath: "download-hover.svg",
            tooltip: "Download",
          },
        ],
      },
    ],
  },
};

export const lrMaintenanceAvailableSoftwareConst = {
  availableSoftwareTable: {
    headers: [
      {
        text: "Release Name",
        value: "releaseName",
      },
      {
        text: "Release Date",
        value: "releaseDate",
      },
      {
        text: "",
        value: "action",
        type: "action",
        align: "end",
        sortable: false,
        zoomIcon: true,
        actionList: [],
        customActionList: [
          {
            name: "update",
            path: "update-software-icon.svg",
            hoverPath: "update-software-hover-icon.svg",
            tooltip: "Update",
          },
        ],
      },
    ],
  },
};

export const lrMaintenanceSoftwareUpdateStatusConst = {
  softwareUpdateStatusTable: {
    headers: [
      {
        text: "Release Name",
        value: "releaseName",
      },
      {
        text: "Release Date",
        value: "releaseDate",
      },
      {
        text: "Status",
        value: "status",
      },
      {
        text: "Progress (%)",
        value: "progress",
      },
      {
        text: " ",
        value: "actionColumn",
        type: "custom",
        align: "end",
        sortable: false,
      },
      {
        text: "",
        value: "action",
        type: "action",
        align: "end",
        width: "50px",
        sortable: false,
        zoomIcon: true,
      },
    ],
  },
};
