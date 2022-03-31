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

export const adminUserTableConst = {
  searchConfig: {
    placeholder: "Search",
    advanceForm: [
      {
        type: "textbox",
        name: "username",
        label: "Username",
        placeholder: "Username",
        value: "",
      },
      {
        type: "textbox",
        name: "role",
        label: "Role",
        placeholder: "Role",
        value: "",
      },
      {
        type: "textbox",
        name: "email",
        label: "Email",
        placeholder: "Email",
        value: "",
      },
    ],
  },
  adminUsersTable: {
    isMultiSelect: true,
    itemKey: "alert_uuid",
    headers: [
      {
        text: "Username",
        value: "username",
      },
      {
        text: "Role",
        value: "role",
      },
      {
        text: "Email",
        value: "email",
      },
      {
        text: "",
        value: "action",
        type: "action",
        align: "end",
        sortable: false,
        actionList: ["edit", "delete"],
      },
    ],
  },
};
