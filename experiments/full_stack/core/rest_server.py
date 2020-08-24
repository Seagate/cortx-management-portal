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
