/*
 ****************************************************************************
 Filename:          CacheProvider.ts
 Description:       Based on the type of specified cache, it provides the cache instance.

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
 * The CacheProvider returns the Cache instance based on the given cache type.
 */

import { Cache } from "../cache";
import { MemoryCache } from "./memory_cache";
import { RedisCache } from "./redis_cache";

export class CacheProvider {
    public getCache(type: string): Cache {
        if (type == "memory-cache")
            return new MemoryCache();
        else if (type == "redis") 
            return new RedisCache();
        else 
            return new MemoryCache;        
    }
}