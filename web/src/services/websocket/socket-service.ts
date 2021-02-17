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
import WebSocket from 'ws';
import * as http from 'http';
import * as https from 'https';

/**
 * SocketService.ts is responsible to listen a WebSocket open by python server
 * Also SocketService creates a new WebSocket Server which can be listen by GUI
 */
export class SocketService {

    wss: WebSocket.Server;

    constructor(server: http.Server | https.Server) {
        this.wss = new WebSocket.Server({ server: server });
    }

    /*
     * Establish a WebSocket connection to receive data (from python)
     * and then open a WebSocket Server connection to send data (to GUI)
     */
    getConnection(path: string) {
        console.log("logger: Open WebSocket Server Connetion");
        this.wss.on('connection', function connection(ws: WebSocket) {
            var wslistener = new WebSocket(path);
            wslistener.onopen = function (e: any) {
                console.log('logger: Connected to WebSocket Server');
            }
            wslistener.onmessage = function (event: any) {
                console.log("logger: Sending Data over WebSocket; Data: " + event.data);
                ws.send(event.data);
            }
            wslistener.onerror = function (err: any) {
                console.log("TCL: SocketService -> wslistener.onerror -> err", err);
            }
            ws.onclose = (closeEvent: any) => {
                console.log("logger: WebSocket connection closed");
                wslistener.close();
            };
        });
    }
}
