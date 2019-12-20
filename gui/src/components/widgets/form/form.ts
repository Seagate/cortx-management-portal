/*****************************************************************************
 Filename:          form.ts
 Description:       Form class

 Creation Date:     13/12/2019
 Author:            Sri Bhargav Metta

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/
import { FormControl } from "./form-control";

export class Form {

    public controlsMap: {
        [name: string]: {
            [id: string]: FormControl
        }
    } = {};
    public isValid: boolean = false;

    public validate() {
        let tempIsValid: boolean = true;
        outerLoop:
        for (const controlName of Object.keys(this.controlsMap)) {
            for (const control of Object.values(this.controlsMap[controlName])) {
                if (!control.isValid) {
                    tempIsValid = false;
                    break outerLoop;
                }
            }
        }
        this.isValid = tempIsValid;
    }

    public addControl(id: string, name: string, type: string, control: FormControl): Form {
        control.id = id;
        control.name = name;
        control.type = type;
        if (this.controlsMap[name]) {
            this.controlsMap[name][id] = control;
        } else {
            this.controlsMap[name] = {};
            this.controlsMap[name][id] = control;
        }
        return this;
    }

    public getModel(): any {
        const model: any = {};
        for (const controlName of Object.keys(this.controlsMap)) {
            for (const control of Object.values(this.controlsMap[controlName])) {
                switch (control.type) {
                    case FormControl.TYPE_TEXT:
                        model[control.name] = control.value.value;
                        break;
                    case FormControl.TYPE_CHECK_BOX:
                        this.setCheckboxModel(control, model);
                        break;
                    case FormControl.TYPE_RADIO_BUTTON:
                        this.setRadioButtonModel(control, model);
                        break;
                }
            }
        }
        return model;
    }

    private setCheckboxModel(control: FormControl, model: any) {
        if (control.value.isSelected) {
            if (model[control.name]) {
                model[control.name].push(control.value.value);
            } else {
                model[control.name] = [control.value.value];
            }
        }
    }

    private setRadioButtonModel(control: FormControl, model: any) {
        if (control.value.isSelected) {
            model[control.name] = control.value.value;
        }
    }
}
