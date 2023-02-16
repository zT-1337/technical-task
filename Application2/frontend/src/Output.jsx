function Output({receivedOutputs}) {
  return (
    <div>
      <p>Output received:</p>
      <ul>
        {receivedOutputs.map(receivedOutput => <li key={receivedOutput.date}>{`From: ${receivedOutput.senderId} Output: ${receivedOutput.output}`}</li>)}
      </ul>
    </div>
  )
}

export default Output;