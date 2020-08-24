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
import { Request, Response, NextFunction } from "express";
import * as sortingparams from '../api-sort-params.json';

/**
 * This API and its parameters and validations are defined in the 
 * api-sort-params.json. 
 * @param req 
 * @param res 
 * @param next 
 */
export const checkSortingParameters = (req: Request, res: Response, next: NextFunction) => {
    let path = req.url.includes("?") ? req.url.substring(0, req.url.indexOf("?")) : req.url;
    var objectValue = JSON.parse(JSON.stringify(sortingparams));
    let sortingParams = objectValue[path];
    let valid = true;
    if (sortingParams) {
        let count = Object.keys(sortingParams).length;
        for (var i = 0; i < count; i++) {
            let sortingParam = sortingParams[i];
            let requestValue = req.query[sortingParam.paramname.trim()];
            let sortParamValues = sortingParam.values.split(",");
            if (requestValue) {
                if (!sortParamValues.includes(requestValue)) {
                    valid = false;
                    break;
                }
            } else {
                console.log("Parameter is not present." + sortingParam.paramname.trim());
            }
        }
    }

    return valid;
}

