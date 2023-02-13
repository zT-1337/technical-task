import Input from "./Input.jsx";
import Output from "./Output.jsx";
import io from "socket.io-client";
import {useState} from "react";

let socket;

function App() {
  const [clientId, setClientId] = useState("NOT CONNECTED");
  const [isConnected, setIsConnected] = useState(false);

  const onConnectPressed = () => {
    socket = io("http://localhost:3000");
    socket.on("connect", () => {
      console.log("connected");
    })

    socket.on("disconnect", () => {
      console.log("disconnected");
      setIsConnected(false);
      setClientId("NOT CONNECTED");

      socket.off("connect");
      socket.off("disconnect");
      socket.off("id");
      socket = undefined;
    })

    socket.on("id", msg => {
      console.log(msg);
      setIsConnected(true);
      setClientId(`Client Id: ${msg}`);
    })
  }

  const onDisconnectPressed = () => {
    socket.disconnect();
  }

  return (
    <div className="container mx-auto p-4 bg-base-200 h-screen flex flex-col">
      <div className="mb-2 text-center">
        <p>{clientId}</p>
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
