/*
 ****************************************************************************
 Filename:          MemoryCache.ts
 Description:       One of the cache alternative, implements Cache interface

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
 * The Memory Cache provides the Cache implementation for in memory cache (memory-cache).
 */

import { Cache } from "../cache";
import cache from "memory-cache";

export class MemoryCache implements Cache {
    
    /** 
     * This cache will be accessed in singleton way to refer to same memory location.
     */ 
    private static memcache: any;

    private static getCache(): any {
        if (!MemoryCache.memcache) {
            MemoryCache.memcache = new cache.Cache();
        }

        return MemoryCache.memcache;
    }

    getData(key: string, callback?: any) {
        return MemoryCache.getCache().get(key);
    }
    
    setData(key: string, value: any): void {
        MemoryCache.getCache().put(key,value);
    }
    
    updateData(key: string, value: any): void {
        MemoryCache.getCache().put(key,value);
    }
    
    deleteData(key: string, value: any): void {
        MemoryCache.getCache().remove(key);
    }       
}