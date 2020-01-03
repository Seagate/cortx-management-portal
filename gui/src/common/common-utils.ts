/*****************************************************************************
 Filename:          common-utils.ts
 Description:       Common Utility functions

 Creation Date:     27/12/2019
 Author:            Vaibhav Bhavsar

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/

import { WizardMetadata } from "../models/system-configuration";
export default abstract class CommonUtils {
  public static findStepIndexFromComponentName(
    componentNameToSearch: string,
    wizardMetadata: WizardMetadata
  ) {
    if (wizardMetadata.steps) {
      return wizardMetadata.steps.findIndex((element: any) => {
        return element.component === componentNameToSearch;
      });
    }
    return -1;
  }
}
