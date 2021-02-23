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
import dotenv from "dotenv";

dotenv.config();
import { createLogger, format, transports } from 'winston';
const { combine, timestamp , json } = format;
const logger = createLogger({
  format: combine(
        timestamp(),
        json(),
      ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: process.env.LOG_FILE_PATH, 
    handleExceptions: true,
    level: process.env.LOG_LEVEL,
    //maxsize: 10485760, //10 MB
    //maxFiles: 5 
    }),
  ],
  exitOnError: false,
});

export default logger;