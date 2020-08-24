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