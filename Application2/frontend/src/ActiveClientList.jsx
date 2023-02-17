function ActiveClientList({activeClients}) {
  return (
    <div className="p-4">
      <p>Active client list:</p>
      <ul>
        {activeClients.map(activeClient =>
          <li className="break-words" key={activeClient}>{`Client Id: ${activeClient}`}</li>
        )}
      </ul>
    </div>
  )
}

export default ActiveClientList;