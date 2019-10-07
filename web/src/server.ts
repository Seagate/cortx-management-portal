import http from "http";
import express from "express";
import cors from "cors";
import { applyMiddleware, applyRoutes } from "./utils";
import middleware from "./middleware";
import errorHandlers from "./middleware/error-handlers";
import routes from "./services";
import { SocketService } from "./services/websocket/socket-service";

require("dotenv").config({ path: __dirname + "/.env" });

process.on("uncaughtException", e => {
  console.log(e);
  process.exit(1);
});

process.on("unhandledRejection", e => {
  console.log(e);
  process.exit(1);
});

const router = express();
router.use(cors());
applyMiddleware(middleware, router);
applyRoutes(routes, router);
applyMiddleware(errorHandlers, router);

const NODE_PORT = process.env.NODE_PORT ? process.env.NODE_PORT : 3000;
const server = http.createServer(router);
const INCOMING_SOCKET_PORT: number = Number(process.env.INCOMING_SOCKET_PORT);
const OUTGOING_SOCKET_PORT: number = Number(process.env.OUTGOING_SOCKET_PORT);
const CSM_AGENT_HOST: string = process.env.CSM_AGENT_HOST || "";

server.listen(NODE_PORT, () => {
  console.log("Server is running at http://localhost:" + NODE_PORT);

  // Server shoud send data over other socket
  const socketServer = new SocketService(OUTGOING_SOCKET_PORT);
  socketServer.getConnection("ws://" + CSM_AGENT_HOST + ":" + INCOMING_SOCKET_PORT + "/ws");

}
);

