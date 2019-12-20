/*****************************************************************************
 Filename:          form-control-validator.ts
 Description:       ControlValidator class

 Creation Date:     15/12/2019
 Author:            Sri Bhargav Metta

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/
export class ControlValidator {
    public static readonly TYPE_REQUIRED = "required";
    public static readonly TYPE_REGEX = "regex";
    public static readonly TYPE_COMPARE_WITH = "compare_with";

    public static required(invalidValueMessage: string): any {
        return {
            type: ControlValidator.TYPE_REQUIRED,
            invalidValueMessage: invalidValueMessage
        };
    }

    public static regex(regex: RegExp, invalidValueMessage: string): any {
        return {
            type: ControlValidator.TYPE_REGEX,
            regex: regex,
            invalidValueMessage: invalidValueMessage
        }
    }

    public static compareWith(compareWithId: string, compareWithName: string, invalidValueMessage: string) {
        return {
            type: ControlValidator.TYPE_COMPARE_WITH,
            compareWithId: compareWithId,
            compareWithName: compareWithName,
            invalidValueMessage: invalidValueMessage
        }
    }
}
