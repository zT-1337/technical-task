import Input from "./Input.jsx";
import Output from "./Output.jsx";
import io from "socket.io-client";
import {useState} from "react";
import { APPLICATION_2_JOIN, CLIENT_JOIN_ERROR, CLIENT_JOIN_SUCCESS } from "./constants.js";

let socket;

function App() {
  const [apiKey, setApiKey] = useState("");
  const [clientId, setClientId] = useState("NOT CONNECTED");
  const [isConnected, setIsConnected] = useState(false);

  const onConnectPressed = () => {
    socket = io("http://localhost:3000");
    socket.on("connect", () => {
      console.log("[Socket.IO] connected");
      socket.emit(APPLICATION_2_JOIN, {apiKey});
    })

    socket.on("disconnect", () => {
      console.log("[Socket.IO] disconnected");
      setIsConnected(false);
      setClientId("NOT CONNECTED");

      socket.off("connect");
      socket.off("disconnect");
      socket.off(CLIENT_JOIN_SUCCESS);
      socket = undefined;
    })

    socket.on(CLIENT_JOIN_SUCCESS, joinMessage => {
      console.log(joinMessage);
      setIsConnected(true);
      setClientId(`Client Id: ${joinMessage.clientId}`);
    });

    socket.on(CLIENT_JOIN_ERROR, errorMessage => {
      console.log(errorMessage);
    });
  }

  const onDisconnectPressed = () => {
    socket.disconnect();
  }

  return (
    <div className="container mx-auto p-4 bg-base-200 h-screen flex flex-col">
      <div className="mb-2 flex flex-row justify-center items-center">
        <p className="mr-2">{clientId}</p>
        <input 
          className="input flex-1 rounded-none"
          type="password" 
          placeholder="API Key" 
          value={apiKey}
          onChange={event => setApiKey(event.target.value)}/>
      </div>
      <div className="flex flex-row flex-1">
        <div className="flex-1">
          <Input />
        </div>
        <div className="flex-1">
          <Output/>
        </div>
      </div>
      <div className="flex flex-row justify-end">
        <button 
          className={`btn-primary btn-wide btn-md mr-8 ${isConnected ? "btn-disabled" : ""}`} 
          onClick={onConnectPressed}
          disabled={isConnected}>
            Connect
        </button>
        <button 
          className={`btn-primary btn-wide btn-md ${!isConnected ? "btn-disabled" : ""}`}
          onClick={onDisconnectPressed}
          disabled={!isConnected}>
            Disconnect
        </button>
      </div>
    </div>
  )
}

export default App;
