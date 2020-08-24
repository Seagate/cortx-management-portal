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
const path = require('path')
const express = require("express");
const app = express();
const apiCallFromRequest = require('./request')
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/notes', (req, res) =>
  apiCallFromRequest.callApi(function (response) {
    res.send(response);
  })
);

app.post('/notes', (req, res) =>
apiCallFromRequest.callPostApi(function (response) {
  res.send(response);
},req.body)
);

app.use('/', express.static('dist', { index: 'index.html' }));

app.listen(8080, () => console.log('Server listening on port 8080!'));

