import dotenv from "dotenv";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import { isInputAuthorized } from "./auth-service.js";
import { addNewApplication1Client, addNewApplication2Client, removeClient } from "./client-service.js";
import { APPLICATION_1_INPUT, APPLICATION_1_JOIN, APPLICATION_2_JOIN, APPLICATION_2_OUTPUT, APPLICATION_TYPE_1, APPLICATION_TYPE_2, CLIENT_JOIN_ERROR, CLIENT_JOIN_SUCCESS } from "./constants.js";

dotenv.config();

const app = express();
const port = 3000;

app.use(express.static("public"));

const httpServer = http.createServer(app);
const websocketServer = new Server(httpServer);

websocketServer.on("connection", socket => {

  socket.on(APPLICATION_1_JOIN, () => {
    const client = addNewApplication1Client();
    socket.join(APPLICATION_TYPE_1);
    socket.clientId = client.clientId;
    socket.emit(CLIENT_JOIN_SUCCESS, client);
  });

  socket.on(APPLICATION_1_INPUT, message => {
    if(!message || !isInputAuthorized(message.auth, APPLICATION_TYPE_1)) {
      console.log(`[${APPLICATION_TYPE_1}] failed to authorize`);
      return;
    }

    console.log(`[${APPLICATION_TYPE_1}] sent input ${message.input}`);
    websocketServer.in(APPLICATION_TYPE_2).emit(
      APPLICATION_2_OUTPUT, 
      {output: message.input, senderId: socket.clientId}
    );
  });

  socket.on(APPLICATION_2_JOIN, credentials => {
    const result = addNewApplication2Client(credentials);
    if(typeof result === 'string') {
      socket.emit(CLIENT_JOIN_ERROR, {error: result});
      socket.disconnect();
      return;
    }
   
    socket.join(APPLICATION_TYPE_2);
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