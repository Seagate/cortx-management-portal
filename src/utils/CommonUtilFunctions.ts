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
import * as moment from "moment";
export const capitalizeFirstLetter = (value: string) => {
  return value.charAt(0).toUpperCase() + value.substring(1);
};

export const formatTime = (date: string) => {
  return moment.default(date).format("DD-MM-YYYY hh:mm A");
};

export function passwordTest(str: string, reg?: string) {
  const standardRegex =
    "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$";
  const regex = new RegExp(reg ? reg : standardRegex);
  return regex.test(str);
}

export function usernameTest(str: string, reg?: string) {
  const standardRegex = "^[ A-Za-z0-9_-]*$";
  const regex = new RegExp(reg ? reg : standardRegex);
  return regex.test(str)
}

export const strEqualityCaseInsensitive = (first: string, second: string) =>
  first.localeCompare(second, undefined, { sensitivity: "base" }) === 0;

export function jsonTest(str: string) {
  try {
    JSON.parse(str);
  } catch (error) {
    return false;
  }
  return true;
}
