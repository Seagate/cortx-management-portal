import { helpers } from "vuelidate/lib/validators";
export const accountNameRegex = helpers.regex(
  "accountNameRegex",
  /^[a-zA-Z0-9_-]{8,64}$/
);
export const passwordRegex = helpers.regex(
  "passwordRegex",
  // tslint:disable-next-line
  /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#\$%\^&\*\(\)\_\+\-\=\[\]\{\}\|\'])[A-Za-z\d!@#\$%\^&\*\(\)\_\+\-\=\[\]\{\}\|\']{8,}/
);

export const bucketNameRegex = helpers.regex(
  "bucketNameRegex",
  /^[a-zA-Z0-9_-]*$/
);

export const iamUserNameRegex = helpers.regex(
  "userNameRegex",
  /^[a-zA-Z0-9_-]{1,64}$/
);
export const iamPathRegex = helpers.regex("pathRegex", /^(\/[^/ ]*)+\/?$/);
export const iamPasswordRegex = helpers.regex(
  "passwordRegex",
  // tslint:disable-next-line
  /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#\$%\^&\*\(\)\_\+\-\=\[\]\{\}\|\'])[A-Za-z\d!@#\$%\^&\*\(\)\_\+\-\=\[\]\{\}\|\']{8,}/
);
