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
  public static copyUrlToClipboard(url: string) {
    const input = document.body.appendChild(document.createElement("input"));
    input.value = url;
    input.focus();
    input.select();
    document.execCommand("copy");
    if (input.parentNode) {
      input.parentNode.removeChild(input);
    }
  }
}
