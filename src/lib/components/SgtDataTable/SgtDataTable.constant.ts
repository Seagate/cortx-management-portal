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
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 * For any questions about this software or licensing,
 * please email opensource@seagate.com.
 */
export const SgtDataTableConst = {
  buttonList: [
    {
      name: "comment",
      path: "comment-default.svg",
      hoverPath: "comment-hover.svg",
      tooltip: "",
    },
    {
      name: "edit",
      path: "edit-green.svg",
      hoverPath: "edit-green.svg",
      tooltip: "edit",
    },
    {
      name: "remove",
      path: "close-green.svg",
      hoverPath: "close-hover.svg",
      tooltip: "remove",
    },
    {
      name: "notification",
      path: "alert-green.svg",
      hoverPath: "alert-hover.svg",
      tooltip: "notification",
    },
    {
      name: "delete",
      path: "delete-green.svg",
      hoverPath: "delete-green.svg",
      tooltip: "delete",
    }
  ],
  defaultTableConfig: {
    pagination: {
      pageSize: 10,
      totalRecords: 10,
      currentPage: 1
    },
    filterList: [],
    sort: null
  },
  defaultPaginationConfig: {
    pageLength: 1,
    totalVisible: 1,
    color: "csmprimary",
    nextIcon: "mdi-chevron-double-right",
    prevIcon: "mdi-chevron-double-left",
    pageSizeList: [
      { text: '5 rows', value: 5 },
      { text: '10 rows', value: 10 },
      { text: '15 rows', value: 15 },
      { text: '20 rows', value: 20 }
    ]
  }
};
