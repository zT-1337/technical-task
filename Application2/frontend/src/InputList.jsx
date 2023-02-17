import { useState } from "react";
import EnterInput from "./inputs/EnterInput.jsx";

function InputList({
  onSendBroadcastPressed, 
  isConnected,
  sentInputs
}) {
  const [input, setInput] = useState("");

  const doSending = () => {
    onSendBroadcastPressed(input);
    setInput("");
  }

  return (
    <div className="p-4" >
      <div className="flex mb-2">
        <EnterInput
          styling={"w-full"}
          type="text" 
          placeholder="Input for Application1"
          value={input}
          onValueChange={setInput}
          onEnter={doSending}
          isDisabled={!isConnected}
        />
        <button 
          className={`btn btn-primary btn-md ${!isConnected || input.length === 0 ? "btn-disabled" : ""}`} 
          disabled={!isConnected || input.length === 0}
          onClick={doSending}
        >
            Send
        </button>
      </div>
      <div>
        <p>Broadcast send:</p>
        <ul>
          {sentInputs.map(sentInput => 
            <li className="break-words" key={sentInput.date}>
              {sentInput.input}
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}

export default InputList;