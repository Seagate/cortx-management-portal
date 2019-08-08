from aiohttp.web import Application, run_app, WebSocketResponse, Response
from aiohttp import WSMsgType

from aio_http_rest import RestResource
from aio_http_ws import ws_register
from models import Notes

import asyncio

# APP_HOST = 'localhost'
APP_HOST = '0.0.0.0'    # Export websock globally for now because
                        # our POC web server does not support
                        # websock forwarding yet
APP_PORT = 8192

def main():
    notes = {}
    app = Application()
    person_resource = RestResource('notes', Notes, notes, ('title', 'description', 'created_at', 'created_by', 'priority'), 'title')
    person_resource.register(app.router)
    ws_register(app)

    run_app(app, host=APP_HOST, port=APP_PORT)


if __name__ == '__main__':
    main()
