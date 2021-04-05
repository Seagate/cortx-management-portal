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
import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../config/swagger.json";
import clientSwaggerDocument from "../config/client_swagger.json";
import clientSwaggerDocumentv2 from "../config/client_swagger_v2.json";

export const handleAPIDocs = (router: Router) => {
  const options = {
    customCssUrl: '/public/custom.css',
    customJs: '/public/custom.js'
  };
  router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));
  router.use("/client-api-docs", swaggerUi.serve, swaggerUi.setup(clientSwaggerDocumentv2, options));
}