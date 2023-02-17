import InputList from "./InputList.jsx";
import OutputList from "./OutputList.jsx";
import EnterInput from "./inputs/EnterInput.jsx";
import io from "socket.io-client";
import {useState} from "react";
import { 
  APPLICATION_2_OUTPUT, 
  APPLICATION_2_INPUT_BROADCAST, 
  APPLICATION_2_JOIN, 
  CLIENT_JOIN_ERROR, 
  CLIENT_JOIN_SUCCESS, 
  LIST_ACTIVE_CLIENTS, 
  LIST_ACTIVE_CLIENTS_SUCCESS, 
  CLIENT_JOINED, 
  CLIENT_DISCONNECTED, 
  APPLICATION_2_INPUT_SINGLE_CLIENT
} from "./constants.js";
import ActiveClientList from "./ActiveClientList.jsx";

let socket;

function App() {
  const [apiKey, setApiKey] = useState("");

  const [clientId, setClientId] = useState("NOT CONNECTED");
  const [auth, setAuth] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  const [receivedOutputs, setReceivedOutputs] = useState([]);

  const [activeClients, setActiveClients] = useState([]);

  const onConnectPressed = () => {
    if(isConnected) {
      return;
    }

    socket = io("http://localhost:3000");
    socket.on("connect", () => {
      console.log("[Socket.IO] connected");
      socket.emit(APPLICATION_2_JOIN, {apiKey});
    })

    socket.on("disconnect", () => {
      console.log("[Socket.IO] disconnected");
      setIsConnected(false);
      setClientId("NOT CONNECTED");
      setAuth("");
      setReceivedOutputs([]);
      setActiveClients([]);

      socket.off("connect");
      socket.off("disconnect");
      socket.off(CLIENT_JOIN_SUCCESS);
      socket.off(CLIENT_JOIN_ERROR);
      socket.off(APPLICATION_2_OUTPUT);
      socket.off(LIST_ACTIVE_CLIENTS_SUCCESS);
      socket.off(CLIENT_JOINED);
      socket.off(CLIENT_DISCONNECTED);
      socket = undefined;
    })

    socket.on(CLIENT_JOIN_SUCCESS, joinMessage => {
      console.log(joinMessage);
      setIsConnected(true);
      setClientId(`Client Id: ${joinMessage.clientId}`);
      setAuth(joinMessage.auth);
      socket.emit(LIST_ACTIVE_CLIENTS, {auth: joinMessage.auth});
    });

    socket.on(CLIENT_JOIN_ERROR, errorMessage => {
      alert(errorMessage.error);
    });

    socket.on(APPLICATION_2_OUTPUT, outputMessage => {
      console.log(outputMessage);
      setReceivedOutputs(receivedOutputs => [...receivedOutputs, {...outputMessage, date: Date.now()}]);
    });

    socket.on(LIST_ACTIVE_CLIENTS_SUCCESS, activeClientsMessage => {
      console.log(activeClientsMessage);
      setActiveClients(activeClientsMessage);
    });

    socket.on(CLIENT_JOINED, joinedClientMessage => {
      console.log(joinedClientMessage);
      setActiveClients(activeClients => [...activeClients, joinedClientMessage]);
    });
   
    socket.on(CLIENT_DISCONNECTED, disconnectClientMessage => {
      console.log(disconnectClientMessage);
      setActiveClients(activeClients => activeClients.filter(
        client => client !== disconnectClientMessage
      ));
    })
  }

  const onDisconnectPressed = () => {
    socket.disconnect();
  }

  const onSendBoradcastPressed = (input) => {
    if(input.length === 0) {
      return;
    }

    socket.emit(APPLICATION_2_INPUT_BROADCAST, {input, auth});
  }

  const onSendToClientPressed = (input, clientId) => {
    if(input.length === 0) {
      return;
    }

    socket.emit(APPLICATION_2_INPUT_SINGLE_CLIENT, {clientId, input, auth});
  }

  return (
    <div className="container mx-auto p-4 bg-base-200 h-fit-content min-h-screen flex flex-col">
      <div className="mb-2 flex flex-row justify-center items-center">
        <p className="mr-2">{clientId}</p>
        <EnterInput 
          styling={"flex-1"}
          type="password"
          placeholder="API Key" 
          value={apiKey}
          onValueChange={setApiKey}
          onEnter={onConnectPressed}
        />
      </div>
      <div className="flex flex-row flex-1">
        <div className="w-1/3">
          <InputList 
            onSendBroadcastPressed={onSendBoradcastPressed}
            isConnected={isConnected}
          />
        </div>
        <div className="w-1/3">
          <OutputList receivedOutputs={receivedOutputs}/>
        </div>
        <div className="w-1/3">
          <ActiveClientList 
            activeClients={activeClients} 
            onSendToClientPressed={onSendToClientPressed}
          />
        </div>
      </div>
      <div className="flex flex-row justify-end">
        <button 
          className={`btn btn-primary btn-wide btn-md mr-8 ${isConnected ? "btn-disabled" : ""}`} 
          onClick={onConnectPressed}
          disabled={isConnected}>
            Connect
        </button>
        <button 
          className={`btn btn-primary btn-wide btn-md ${!isConnected ? "btn-disabled" : ""}`}
          onClick={onDisconnectPressed}
          disabled={!isConnected}>
            Disconnect
        </button>
      </div>
    </div>
  )
}

export default App;
