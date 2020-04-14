import { helpers } from "vuelidate/lib/validators";
export const accountNameRegex = helpers.regex(
  "accountNameRegex",
  /^[a-zA-Z0-9_-]{4,56}$/
);
export const accountNameTooltipMessage =
  "Min 4 to 56 characters. Only alphanumeric, underscore and hyphen are allowed.";

export const bucketNameRegex = helpers.regex(
  "bucketNameRegex",
  /^[a-z0-9][a-z0-9-]{3,54}[a-z0-9]$/
);
// tslint:disable-next-line
export const bucketNameTooltipMessage = `Min 4 to 56 characters. Only lowercase, numeric and hyphen are allowed.
  Not starting or ending with '-'`;

export const passwordRegex = helpers.regex(
  "passwordRegex",
  // tslint:disable-next-line
  /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#\$%\^&\*\(\)\_\+\-\=\[\]\{\}\|\'])[A-Za-z\d!@#\$%\^&\*\(\)\_\+\-\=\[\]\{\}\|\']{8,}/
);
export const passwordTooltipMessage =
"Password must contain:Minimum 8 characters One uppercase letter One lowercase letter One special character One number";

export const iamPathRegex = helpers.regex("pathRegex", /^(\/[^/ ]*)+\/?$/);
// tslint:disable-next-line
export const commaSeparatedEmailsRegex = helpers.regex(
  "commaSeparatedEmailsRegex",
  /^(\s?[^\s,]+@[^\s,]+\.[^\s,]+\s?,)*(\s?[^\s,]+@[^\s,]+\.[^\s,]+)$/
);
const admintooltipmsg = "The username must be of minimum 4 characters and maximum 56 characters.";
const admintooltipmsg1 = "The username must be alphanumeric and can contain underscore (_) and dash (-).";
const admintooltip = admintooltipmsg.concat(admintooltipmsg1.toString());

export const adminaccountNameTooltipMessage = "" + admintooltip;
