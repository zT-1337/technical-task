import ActiveClient from "./ActiveClient";

function ActiveClientList({activeClients, onSendToClientPressed}) {
  return (
    <div className="p-4">
      <p>Active client list:</p>
      <ul>
        {activeClients.map(activeClient =>
          <li key={activeClient}>
            <ActiveClient 
              activeClient={activeClient} 
              onSendToClientPressed={onSendToClientPressed}
            />
          </li>
        )}
      </ul>
    </div>
  )
}

export default ActiveClientList;