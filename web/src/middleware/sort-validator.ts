/*****************************************************************************
 Filename:          sortingValidations.ts
 Description:       validates the request parameters based on the criteria
                    mentioned in apisortingparameters.json.

 Creation Date:     26/08/2019
 Author:            Soniya Moholkar

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/
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

