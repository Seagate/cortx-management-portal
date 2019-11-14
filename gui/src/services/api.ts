/*****************************************************************************
 Filename:          api.ts
 Description:       API Service

 Creation Date:     05/09/2019
 Author:            Sanjeevan Bhave

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/
import axios from "axios";

export abstract class Api {

    // Wrapper method to for get api
    public static async getAll(url: string, queryParams?: object) {
        return await axios.get(url, { params: queryParams });
    }
    // Wrapper method for update api
    public static async patch(url: string, payload: object, id: number) {
        return await axios.patch(url + "/" + id, payload);
    }
    // Wrapper method for post api
    public static async post(url: string, payload: object) {
        return await axios.post(url, payload);
    }
}
