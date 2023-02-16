function Output({receivedOutputs}) {
  return (
    <div className="p-4">
      <p>Output received:</p>
      <ul>
        {receivedOutputs.map(receivedOutput => 
          <li className="break-words" key={receivedOutput.date}>
            {`From: ${receivedOutput.senderId} Output: ${receivedOutput.output}`}
          </li>
        )}
      </ul>
    </div>
  )
}

export default Output;