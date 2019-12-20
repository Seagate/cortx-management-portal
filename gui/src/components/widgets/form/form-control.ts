/*****************************************************************************
 Filename:          form-control.ts
 Description:       FormControl class

 Creation Date:     13/12/2019
 Author:            Sri Bhargav Metta

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/
export class FormControl {
    public static readonly TYPE_TEXT = "text";
    public static readonly TYPE_CHECK_BOX = "checkbox";
    public static readonly TYPE_RADIO_BUTTON = "radio";

    public id: string;
    public name: string;
    public type: string;
    public value: ControlValue;
    public validators: any[];
    public config: ControlConfiguration;
    public isDisabled: boolean;
    public isDirty: boolean = false;
    public isValid: boolean = false;

    constructor(value: ControlValue, validators: any[] = [], config?: ControlConfiguration, isDisabled: boolean = false) {
        this.value = value;
        if (validators) {
            this.validators = validators;
        }
        if (config) {
            this.config = config;
        }
        this.isDisabled = isDisabled;
    }
}

export interface ControlValue {
    value: string;
    isSelected?: boolean;
}

export interface ControlConfiguration {
    label?: string;
    informationText?: string;
}

export interface ControlCompareWith {
    id: string;
    name: string;
}
