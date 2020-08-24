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
const request = require('request');

//_EXTERNAL_URL = 'https://test-proj-heroku.herokuapp.com/api/plans';
//_EXTERNAL_URL = 'http://10.230.161.45:8080/notes';

let CORE = {
    proto : 'http:',
    host  : 'localhost',
    port  : 8192,
    path  : '/notes'
};
_EXTERNAL_URL = CORE.proto + '//' + CORE.host + ':' + CORE.port + CORE.path;

const callExternalApiUsingRequest = (callback) => {
    request(_EXTERNAL_URL, { json: true },
        (err, res, body) => {
            if (err) { 
                return callback(err);
            }
            return callback(body);
        });
}
const callPostApiRequest = (callback, data) => {
    request.post(
        { url: _EXTERNAL_URL, json: data },
        (err, httpResponse, body) => {
            return callback(body);
        })

}
module.exports.callApi = callExternalApiUsingRequest;
module.exports.callPostApi = callPostApiRequest;
