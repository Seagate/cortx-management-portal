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

import axios, { AxiosResponse, AxiosError } from "axios";

export abstract class Api {
  public static async getData(
    url: string,
    { isDummy = false, queryParams = {} }
  ): Promise<AxiosResponse | unknown> {
    if (isDummy) {
      /* eslint-disable */
      const data = require("../../tests/DummyData.json")[url];

      // if (queryParams) {
      // }

      return Promise.resolve(data);
    }

    return await axios
      .get(url, { params: queryParams })
      .then((response) => {
        return Promise.resolve(response);
      })
      .catch((error) => {
        const apiResponse: AxiosError = error;

        return Promise.reject(apiResponse);
      });
  }
}
