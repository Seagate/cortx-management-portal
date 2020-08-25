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
import loginRoutes from "./login/routes";
import alertRoutes from "./alerts/routes";
import systemConfigRoutes from "./onboarding/routes";
import statsRoutes from "./stats/routes";
import udxRoutes from "./udx/routes";
import userRoutes from "./user/routes";
import s3Routes from "./s3/routes";
import s3BucketRoutes from "./s3/bucket/routes";
import s3AccessKeyRoutes from "./s3/access-key/routes";
import capacityRoutes from "./stats/capacity/routes";
import alertsHistoryRoutes from "./alerts_history/routes";
import userConfigRoutes from "./onboarding/userconfig/routes";
import systemHealthRoutes from "./system/routes";
import audit from "./audit/routes";
import firmware from "./firmware/routes";
import ssl from "./ssl/routes";
import software from "./software/routes";
import about from "./about/routes";

export default [
  ...loginRoutes,
  ...alertRoutes,
  ...systemConfigRoutes,
  ...statsRoutes,
  ...udxRoutes,
  ...userRoutes,
  ...s3Routes,
  ...s3BucketRoutes,
  ...s3AccessKeyRoutes,
  ...capacityRoutes,
  ...userConfigRoutes,
  ...alertsHistoryRoutes,
  ...systemHealthRoutes,
  ...audit,
  ...firmware,
  ...ssl,
  ...software,
  ...about
];
