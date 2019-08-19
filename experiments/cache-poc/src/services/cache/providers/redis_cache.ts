/*
 ****************************************************************************
 Filename:          Redis.ts
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
 * The Redis provides the Cache implementation for Redis cache.
 */

import { Cache } from "../cache";
import redis from "redis";

export class RedisCache implements Cache {

    /**
     * The client is created in singleton way as to avoid creating multiple instances.
     */
    private static client: any;

    private static getClient(): any {
        if (!RedisCache.client) {
            RedisCache.client = redis.createClient();
        }

        return RedisCache.client;
    }

    getData(key: string, callback?: any) {
        return RedisCache.getClient().get(key);
    }
    
    setData(key: string, value: any): void {
        RedisCache.getClient().put(key,value);
    }
    
    updateData(key: string, value: any): void {
        RedisCache.getClient().put(key,value);
    }
    
    deleteData(key: string, value: any): void {
        RedisCache.getClient().remove(key);
    }
}