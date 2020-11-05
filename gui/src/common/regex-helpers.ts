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
import { helpers } from "vuelidate/lib/validators";
export const accountNameRegex = helpers.regex(
  "accountNameRegex",
  /^[a-zA-Z0-9_-]{4,56}$/
);
export const accountNameTooltipMessage =
  // tslint:disable-next-line: max-line-length
  "The account name must be of minimum 4 characters and maximum 56 characters. The username must be alphanumeric and can contain underscore (_) and dash (-).";

export const usernameTooltipMessage =
  // tslint:disable-next-line
  "The username must be of minimum 4 characters and maximum 56 characters. The username must be alphanumeric and can contain underscore (_) and dash (-). The username must not be 'root' or 'Root'.";

export const bucketNameRegex = helpers.regex(
  "bucketNameRegex",
  /^[a-z0-9][a-z0-9-.]{3,54}[a-z0-9]$/
);
export const bucketNameTooltipMessage = `The bucket name must be of minimum 4 characters and maximum 56 characters.
Only lowercase, numbers, dash(-) and dot (.) are allowed. The bucket name cannot start and end with a dash (-) or dot(.).`;

export const passwordRegex = helpers.regex(
  "passwordRegex",
  // tslint:disable-next-line
  /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#\$%\^&\*\(\)\_\+\-\=\[\]\{\}\|\'])[A-Za-z\d!@#\$%\^&\*\(\)\_\+\-\=\[\]\{\}\|\']{8,}/
);
export const passwordTooltipMessage =
  // tslint:disable-next-line
  "Password must contain: Minimum 8 characters, One uppercase letter, One lowercase letter, One special character, and One number";

export const iamPathRegex = helpers.regex("pathRegex", /^(\/[^/ ]*)+\/?$/);
// tslint:disable-next-line
export const commaSeparatedEmailsRegex = helpers.regex(
  "commaSeparatedEmailsRegex",
  /^(\s?[^\s,]+@[^\s,]+\.[^\s,]+\s?,)*(\s?[^\s,]+@[^\s,]+\.[^\s,]+)$/
);

export const udxBucketNameRegex = helpers.regex(
  "udxBucketNameRegex",
  /^[a-z0-9-.]{0,51}[a-z0-9]$/
);
// tslint:disable-next-line
export const udxBucketNameTooltipMessage = `To identify the S3 bucket correctly, the Bucket name will always use "udx" as its prefix. The bucket name must be of minimum 5 characters and maximum 56 characters.
  Only lowercase, numbers, dash(-) and dot (.) are allowed. The bucket name cannot start and end with a dash (-) or dot(.).`;

export const udxURLRegex = helpers.regex(
  "udxURLRegex",
  /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/
);

export const ipOrDomainRegex = helpers.regex(
  "ipOrDomainRegex",
  // tslint:disable-next-line
  /(?:^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z]$|(^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?))$)/
);

export const applianceNameRegex = helpers.regex(
  "applianceNameRegex",
  /^[A-Za-z0-9_-]+$/
);
export const userNameRegex = helpers.regex(
  "userNameRegex",
  /^((?!root)(?!Root).)*$/
);
