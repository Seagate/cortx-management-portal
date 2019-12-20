/*****************************************************************************
 Filename:          form-widget.ts
 Description:       Form Widget Model

 Creation Date:     21/11/2019
 Author:            Sri Bhargav Metta

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/

export class Form {
    public controls: FormControl[];
    public isValid: boolean;

    constructor(controls: FormControl[], isValid: boolean = false) {
        this.controls = controls;
        this.isValid = isValid;
    }

    public getModel(): any {
        const model: any = {};
        this.controls.forEach((control) => {
            model[control.name] = control.value;
        });
        return model;
    }

    public validate() {
        let tempIsValid: boolean = true;
        for (const control of this.controls) {
            if (!control.isValid) {
                tempIsValid = false;
                break;
            }
        }
        this.isValid = tempIsValid;
    }
}

export class FormControl {
    public label: string;
    public name: string;
    public type: string;
    public value: string;
    public isRequired: boolean;
    public requiredMessage: string;
    public validator: Validator;
    public isDirty: boolean = false;
    public isValid: boolean = false;
    public informationText: string;

    constructor(label: string, name: string, type: string, value: string, isRequired: boolean = false, requiredMessage: string = "", validator?: Validator, informationText?: string) {
        this.label = label;
        this.name = name;
        this.type = type;
        this.value = value;
        this.isRequired = isRequired;
        this.requiredMessage = requiredMessage;
        if (validator) {
            this.validator = validator;
        }
        if (informationText) {
            this.informationText = informationText;
        }
    }
}

export class Validator {
    public validatorRegEx: RegExp;
    public invalidMessage: string;

    constructor(validatorRegEx: RegExp, invalidMessage: string) {
        this.validatorRegEx = validatorRegEx;
        this.invalidMessage = invalidMessage;
    }
}
