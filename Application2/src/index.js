import dotenv from "dotenv";
import express from "express";
import http from "http";
import {Server} from "socket.io";
import {addNewApplication1Client, removeClient} from "./client-service.js";
import {APPLICATION_1_JOIN, APPLICATION_TYPE_1, CLIENT_JOIN_SUCCESS} from "./constants.js";

dotenv.config();

const app = express();
const port = 3000;

app.use(express.static("public"));

const httpServer = http.createServer(app);
const websocketServer = new Server(httpServer);

websocketServer.on("connection", socket => {

  socket.on(APPLICATION_1_JOIN, () => {
    const client = addNewApplication1Client();
    socket.clientId = client.clientId;
    socket.emit(CLIENT_JOIN_SUCCESS, client);
  });

  socket.on("disconnect", () => {
    removeClient(socket.clientId);
  });
});

httpServer.listen(port, () => {
  console.log(`Application2 listening on port ${port}`)
});