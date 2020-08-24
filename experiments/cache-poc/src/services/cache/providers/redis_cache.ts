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