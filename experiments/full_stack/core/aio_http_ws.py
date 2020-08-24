# CORTX-CSM: CORTX Management web and CLI interface.
# Copyright (c) 2020 Seagate Technology LLC and/or its Affiliates
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as published
# by the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU Affero General Public License for more details.
# You should have received a copy of the GNU Affero General Public License
# along with this program. If not, see <https://www.gnu.org/licenses/>.
# For any questions about this software or licensing,
# please email opensource@seagate.com or cortx-questions@seagate.com.

import os
import json
import asyncio
from aiohttp import web, WSMsgType
from datetime import datetime
from weakref import WeakSet

def dbglog(*args, **kwargs):
    print(*args, **kwargs)

BG_SLEEP_SECONDS = 15
STG_WS_CLIENTS = 'ws.clients'
STG_WS_BGTASK = 'ws.bgtask'

async def ws_background(app):
    dbglog(f'background start {app}')
    try:
        while True:
            await asyncio.sleep(BG_SLEEP_SECONDS)

            ts = datetime.utcnow().isoformat() + 'Z'
            dbglog(f'background [{ts}] {app}')
            await ws_broadcast(app, f'TIME: {ts}')

    except asyncio.CancelledError:
        dbglog(f'background cancel {app}')

    dbglog(f'background done {app}')

async def ws_startup(app):
    dbglog(f'startup {app}')
    app[STG_WS_BGTASK] = app.loop.create_task(ws_background(app))
    app[STG_WS_CLIENTS] = WeakSet()

async def ws_shutdown(app):
    dbglog(f'shutdown {app}')
    app[STG_WS_BGTASK].cancel()
    pass

async def ws_broadcast(app, msg):
    clients = app[STG_WS_CLIENTS].copy()  # do explicit copy here because the
                                          # list can change asynchronously
    try:
        for ws in clients:
            await ws.send_str(msg)
    except:
        dbglog(f'broadcast error')

async def ws_handler(request):
    dbglog(f'ws handler {request}')

    ws = web.WebSocketResponse()
    dbglog(f'ws response {ws}')
    await ws.prepare(request)

    app = request.app
    app[STG_WS_CLIENTS].add(ws)

    dbglog(f'ws async message loop {ws}')
    try:
        async for msg in ws:
            if msg.type == WSMsgType.TEXT:
                dbglog(f'ws replying to msg \'{msg.data}\'')
                await ws_broadcast(app, f'{msg.data}/answer')
            elif msg.type == WSMsgType.ERROR:
                dbglog(f'ws connection closed with exception {ws.exception()}')
    finally:
        request.app[STG_WS_CLIENTS].discard(ws)

    dbglog(f'ws connection closed {ws}')
    return ws

def ws_register(app):
    app.router.add_get('/ws', ws_handler)
    app.on_startup.append(ws_startup)
    app.on_shutdown.append(ws_shutdown)
