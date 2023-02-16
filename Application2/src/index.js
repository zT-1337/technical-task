import dotenv from "dotenv";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import { addNewApplication1Client, addNewApplication2Client, removeClient } from "./client-service.js";
import { APPLICATION_1_JOIN, APPLICATION_2_JOIN, CLIENT_JOIN_ERROR, CLIENT_JOIN_SUCCESS } from "./constants.js";

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

  socket.on(APPLICATION_2_JOIN, credentials => {
    const result = addNewApplication2Client(credentials);
    if(typeof result === 'string') {
      socket.emit(CLIENT_JOIN_ERROR, {error: result});
      socket.disconnect();
      return;
    }
    
    socket.clientId = result.clientId;
    socket.emit(CLIENT_JOIN_SUCCESS, result);
  });

  socket.on("disconnect", () => {
    if(socket.clientId !== undefined) {
      removeClient(socket.clientId);
    }
  });
});

httpServer.listen(port, () => {
  console.log(`Application2 listening on port ${port}`)
});