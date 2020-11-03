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
// Interface for CSM schema for S3 account
export interface Account {
  account_name: string;
  account_email: string;
  password: string;
  access_key: string;
  secret_key: string;
  account_id: string;
  canonical_id: string;
}
export interface AccessKey {
  user_name: string;
  access_key_id: string;
  status: string;
  last_used: number;
}

export interface IAMUser {
  user_name: string;
  user_id: string;
  password: string;
  arn: string;
  path: string;
  access_key_id: string;
  secret_key: string;
  require_reset: boolean;
}

export interface Bucket {
  bucket_name: string;
  bucket_url: string;
}
