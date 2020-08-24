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

/*
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