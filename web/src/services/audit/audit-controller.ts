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
import { Api } from "./../api";
import apiRegister from "./../api-register";
import { Request, Response, request, response } from "express";

export const downloadAuditlog = async (req: Request, res: Response) => {
  let url = apiRegister.get_auditlogs(req.params.version);
  if (req.params.component) {
    url += "/download/" + req.params.component;
  }
  let auditlog = await Api.getFile(url, req, res);
  return auditlog;
};

export const showAuditlog = async (req: Request, res: Response) => {
  let url = apiRegister.get_auditlogs(req.params.version);
  if (req.params.component) {
    url += "/show/" + req.params.component;
  }
  let auditlog = Api.getAll(url, req, res);
  return auditlog;
};


