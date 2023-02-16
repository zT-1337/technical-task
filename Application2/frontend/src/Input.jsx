function Input({
  input, 
  onInputChange, 
  onSendPressed, 
  isConnected, 
  sentInputs
}) {
  return (
    <div className="mr-8">
      <div className="flex mb-2">
        <input 
          className="input w-full rounded-none" 
          type="text" 
          placeholder="Input for Application1"
          value={input}
          onChange={event => onInputChange(event.target.value)}
          onKeyDown={event => {
            if(event.key === "Enter" && input.length > 0) {
              onSendPressed();
            }
          }}/>
        <button 
          className={`btn-primary btn-md ${!isConnected || input.length === 0 ? "btn-disabled" : ""}`} 
          disabled={!isConnected}
          onClick={onSendPressed}>
            Send
        </button>
      </div>
      <div>
        <p>Input send:</p>
        <ul>
          {sentInputs.map(sentInput => <li key={sentInput.date}>{sentInput.input}</li>)}
        </ul>
      </div>
    </div>
  )
}

export default Input;