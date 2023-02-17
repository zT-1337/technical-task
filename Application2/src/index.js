import dotenv from "dotenv";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import { createJWT, isInputAuthorized, isValidApiKey } from "./auth-service.js";
import { 
  addNewApplication1Client,
  addNewApplication2Client,
  listAllActiveApplication1Clients,
  removeClient
} from "./client-service.js";
import { 
  APPLICATION_1_INPUT, 
  APPLICATION_2_OUTPUT, 
  APPLICATION_2_INPUT,
  APPLICATION_1_OUTPUT,
  APPLICATION_1_JOIN, 
  APPLICATION_2_JOIN, 
  APPLICATION_TYPE_1, 
  APPLICATION_TYPE_2, 
  CLIENT_JOIN_ERROR, 
  CLIENT_JOIN_SUCCESS, 
  LIST_ACTIVE_CLIENTS,
  LIST_ACTIVE_CLIENTS_SUCCESS,
  INVALID_API_KEY
} from "./constants.js";

dotenv.config();

const app = express();
const port = 3000;

app.use(express.static("public"));

const httpServer = http.createServer(app);
const websocketServer = new Server(httpServer);

websocketServer.on("connection", socket => {

  socket.on(APPLICATION_1_JOIN, () => {
    const clientId = addNewApplication1Client();
    socket.join(APPLICATION_TYPE_1);
    socket.clientId = clientId;
    socket.emit(CLIENT_JOIN_SUCCESS, {clientId, auth: createJWT({clientId, type: APPLICATION_TYPE_1})});
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

  socket.on(APPLICATION_2_JOIN, apiKeyCredentials => {
    if(!apiKeyCredentials || !isValidApiKey(apiKeyCredentials.apiKey)) {
      console.log(`[${APPLICATION_TYPE_2}] failed to authorize`);
      socket.emit(CLIENT_JOIN_ERROR, {error: INVALID_API_KEY});
      return;
    }

    try {
      const clientId = addNewApplication2Client(apiKeyCredentials);
      socket.join(APPLICATION_TYPE_2);
      socket.clientId = clientId;
      socket.emit(CLIENT_JOIN_SUCCESS, {clientId, auth: createJWT({clientId, type: APPLICATION_TYPE_1})});
    } catch (error) {
      socket.emit(CLIENT_JOIN_ERROR, {error: error.message});
      socket.disconnect();
    }
  });

  socket.on(APPLICATION_2_INPUT, message => {
    if(!message || !isInputAuthorized(message.auth, APPLICATION_TYPE_2)) {
      console.log(`[${APPLICATION_TYPE_2}] failed to authorize`);
      return;
    }

    console.log(`[${APPLICATION_TYPE_2}] sent input ${message.input}`);
    websocketServer.in(APPLICATION_TYPE_1).emit(
      APPLICATION_1_OUTPUT, 
      {output: message.input, senderId: socket.clientId}
    );
  });

  socket.on(LIST_ACTIVE_CLIENTS, credentials => {
    if(!credentials || !isInputAuthorized(credentials.auth, APPLICATION_TYPE_2)) {
      console.log(`[${APPLICATION_TYPE_2}] failed to authorize`);
      return;
    }

    console.log(`[${APPLICATION_TYPE_2}] asked for active ${APPLICATION_TYPE_1} client list`);
    socket.emit(LIST_ACTIVE_CLIENTS_SUCCESS, listAllActiveApplication1Clients());
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