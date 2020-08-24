<!--
CORTX-CSM: CORTX Management web and CLI interface.
Copyright (c) 2020 Seagate Technology LLC and/or its Affiliates
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.
This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.
You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.
For any questions about this software or licensing,
please email opensource@seagate.com or cortx-questions@seagate.com.
-->
# Integration of NodeJS, Python

This is POC where data flows like
- GUI<-->REST(NodeJS/ExpressJS)<-->REST(Python/aiohttp)
- GUI<--> Websocket(NodeJS)<-->Websocket(Python)


## Folder hierarchy

- csm-core:-- Python Project for CSM-Core
- csm-web:-- NodeJS Project for exposing REST
- csm-gui:-- VueJS project for GUI 

In future we may think to merge csm-web and csm-gui. But for now I have kept them as 2 different projects. Need to think more if we should merge them or not


## Building


#### CSM-Core:
Requirements:-- 
- Python 3.6
- PIP

for all other requirement see requirements.txt

To install all of them run following command 

`pip install -r requirements.txt`

To run the core

   `python3 rest_server.py`

REST runs on

  http://localhost:8192/notes

WebSockets run on

  ws://vmip:8192/ws

### CSM-GUI
For now this is a sample GUI which shows Notes and you can update notes as this is part of POC.
Requirements:
- nodejs : 10.15.3 or above
- npm : 6.4.1
- vue cli version : 3.9.3

Run command in CSM-GUI folder

 `npm install`

Build CSM-GUI in production mode
 
 `npm run build` 

It will generate "dist" folder.

### CSM-WEB

Deploy CSM-GUI and run ExpressJS server to production:
- Copy this "dist" from csm-gui folder to csm-web folder
- Type npm start to start the web server.
- Access the GUI at http://vmip:8080 from browser
