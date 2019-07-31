# Integration of NodeJS, Python

This is POC where data flows like
- UI<-->REST(NodeJS/ExpressJS)<-->REST(Python/aiohttp)
- UI<--> Websocket(NodeJS)<-->Websocket(Python)


## Folder hierarchy

- csm-core:-- Python Project for CSM-Core
- csm-web:-- NodeJS Project for exposing REST
- csm-ui:-- VueJS project for UI 

In future we may think to merge csm-web and csm-ui. But for now I have kept them as 2 different projects. Need to think more if we should merge them or not


## Building


#### CSM-Core:
Requirements:-- 
- Python 3.6
- PIP

for all other requirement see requirements.txt

To install all of them run following command 

`pip install -r requirements.txt`

To run the core

   `python3 aio-app.py`

REST runs on

  http://localhost:8192/notes

WebSockets run on

  ws://vmip:8192/ws

### CSM-UI
For now this is a sample UI which shows Notes and you can update notes as this is part of POC.
Requirements:
- nodejs : 10.15.3 or above
- npm : 6.4.1
- vue cli version : 3.9.3

Run command in CSM-UI folder

 `npm install`

Build CSM-UI in production mode
 
 `npm run build` 

It will generate "dist" folder.

### CSM-WEB

Deploy CSM-UI and run ExpressJS server to production:
- Copy this "dist" from csm-ui folder to csm-web folder
- Type npm start to start the web server.
- Access the UI at http://vmip:8080 from browser
