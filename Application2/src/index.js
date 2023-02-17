import dotenv from "dotenv";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import { 
  createJWT,
  tryToAuthenticateWithApiKey, 
  tryToAuthorize
} from "./auth-service.js";
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
  CLIENT_JOINED,
  CLIENT_DISCONNECTED
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
    websocketServer.in(APPLICATION_TYPE_2).emit(CLIENT_JOINED, clientId);
  });

  socket.on(APPLICATION_1_INPUT, message => {
    try {
      tryToAuthorize(message, APPLICATION_TYPE_1);

      console.log(`[${APPLICATION_TYPE_1}] sent input ${message.input}`);

      websocketServer.in(APPLICATION_TYPE_2).emit(
        APPLICATION_2_OUTPUT, 
        {output: message.input, senderId: socket.clientId}
      );
    } catch (error) {
      return;
    }
  });

  socket.on(APPLICATION_2_JOIN, message => {
    try {
      tryToAuthenticateWithApiKey(message);

      const clientId = addNewApplication2Client();

      socket.join(APPLICATION_TYPE_2);
      socket.clientId = clientId;
      socket.emit(
        CLIENT_JOIN_SUCCESS, 
        {
          clientId, 
          auth: createJWT({clientId, type: APPLICATION_TYPE_2})
        }
      );
    } catch (error) {
      socket.emit(CLIENT_JOIN_ERROR, {error: error.message});
      socket.disconnect();
    }
  });

  socket.on(APPLICATION_2_INPUT, message => {
    try {
      tryToAuthorize(message, APPLICATION_TYPE_2);

      console.log(`[${APPLICATION_TYPE_2}] sent input ${message.input}`);

      websocketServer.in(APPLICATION_TYPE_1).emit(
        APPLICATION_1_OUTPUT, 
        {output: message.input, senderId: socket.clientId}
      );
    } catch (error) {
      return;
    }
  });

  socket.on(LIST_ACTIVE_CLIENTS, message => {
    try {
      tryToAuthorize(message, APPLICATION_TYPE_2);
      socket.emit(LIST_ACTIVE_CLIENTS_SUCCESS, listAllActiveApplication1Clients());
    } catch (error) {
      return;
    }

  });

  socket.on("disconnect", () => {
    if(socket.clientId !== undefined) {
      removeClient(socket.clientId);
      websocketServer.to(APPLICATION_TYPE_2).emit(CLIENT_DISCONNECTED, socket.clientId);
    }
  });
});

httpServer.listen(port, () => {
  console.log(`Application2 listening on port ${port}`)
});