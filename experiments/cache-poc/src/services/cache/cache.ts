 /*
 ****************************************************************************
 Filename:          Cache.ts
 Description:       Interface for cache alternatives

 Creation Date:     16/08/2019
 Author:            Soniya Moholkar

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 ****************************************************************************
*/
 /** 
  * This is the interface for all the cache alternatives.
  */
export interface Cache {
    /**
     * Get data from cache for the given key. callback is an optional parameter.
     * @param key 
     * @param callback (optional)
     */
    getData(key: string, callback?:any): any;

    /**
     * 
     * @param key If data is not present in cache, set the data in cache in key/value pair.
     * @param value 
     * @param callback (optional)
     */
    setData(key: string, value: any, callback?:any): void;

    /**
     * If the data is present for the given key, update the data with given value.
     * @param key 
     * @param value 
     * @param callback (optional)
     */
    updateData(key: string, value: any, callback?:any): void;

    /**
     * Delete the data from cache for the given key.
     * @param key 
     * @param value 
     * @param callback (optional)
     */
    deleteData(key: string, value: any, callback?:any): void;    
}