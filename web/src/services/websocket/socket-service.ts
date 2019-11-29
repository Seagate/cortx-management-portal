/*****************************************************************************
 Filename:          SocketService.ts
 Description:       WebSocket service layer

 Creation Date:     14/08/2019
 Author:            Sanjeevan Bhave

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/

import WebSocket from 'ws';

/**
 * SocketService.ts is responsible to listen a WebSocket open by python server
 * Also SocketService creates a new WebSocket Server which can be listen by GUI
 */
export class SocketService {

    wss: WebSocket.Server;

    constructor(serverport: number) {
        this.wss = new WebSocket.Server({ port: serverport });
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
        });
    }
}
