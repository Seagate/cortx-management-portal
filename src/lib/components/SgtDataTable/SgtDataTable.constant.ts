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
      tooltip: "Comment",
    },
    {
      name: "edit",
      path: "edit-green.svg",
      hoverPath: "edit-hover.svg",
      tooltip: "Edit",
    },
    {
      name: "remove",
      path: "close-green.svg",
      hoverPath: "close-hover.svg",
      tooltip: "Remove",
    },
    {
      name: "notification",
      path: "alert-green.svg",
      hoverPath: "alert-hover-green.svg",
      tooltip: "Acknowledge",
    },
    {
      name: "delete",
      path: "delete-green.svg",
      hoverPath: "delete-hover.svg",
      tooltip: "Delete",
    },
  ],
  defaultTableConfig: {
    pagination: {
      pageSize: 10,
      totalRecords: 10,
      currentPage: 1,
    },
    filterList: [],
    sort: null,
  },
  defaultPaginationConfig: {
    pageLength: 1,
    totalVisible: 1,
    color: "csmprimary",
    nextIcon: "mdi-chevron-double-right",
    prevIcon: "mdi-chevron-double-left",
    pageSizeList: [
      { label: "5 rows", value: 5 },
      { label: "10 rows", value: 10 },
      { label: "15 rows", value: 15 },
      { label: "20 rows", value: 20 },
    ],
  },
};
