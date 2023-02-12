import express from "express";
import http from "http";
import {Server} from "socket.io";
import {getNextId} from "./id.js";

const app = express();
const port = 3000;

const httpServer = http.createServer(app);
const websocketServer = new Server(httpServer);

websocketServer.on("connection", socket => {
  console.log("User connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

  socket.on("application1-input", message => {
    console.log(message);
  })

  socket.emit("id", getNextId().toString());
})


httpServer.listen(port, () => {
  console.log(`Application2 listening on port ${port}`)
})