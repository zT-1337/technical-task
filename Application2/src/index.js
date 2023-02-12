import express from "express";
import http from "http";
import {Server} from "socket.io";
import { getNextId } from "./id.js";

const app = express();
const port = 3000;

const httpServer = http.createServer(app);
const websocketServer = new Server(httpServer);

websocketServer.on("connection", socket => {
  socket.emit("id", getNextId().toString());
})

httpServer.listen(port, () => {
  console.log(`Application2 listening on port ${port}`)
})