import { useState } from "react";

function ActiveClient({activeClient, onSendToClientPressed}) {
  const [isOpen, setOpen] = useState(false);
  const [input, setInput] = useState("");

  return (
    <div className="my-4">
      <button className={`btn btn-wide w-full ${!isOpen ? "btn-primary" : ""}`} onClick={() => setOpen(!isOpen)}>
        <p className="break-word">{`Client Id: ${activeClient}`}</p>
      </button>
      {isOpen && 
        <div className="flex">
          <input 
            className="input w-full rounded-none" 
            type="text"
            placeholder={`Input for ${activeClient}`}
            value={input}
            onChange={event => setInput(event.target.value)}
            onKeyDown={event => {
              if(event.key === "Enter" && input.length > 0) {
                onSendToClientPressed(input, activeClient);
                setInput("");
              }
            }}/>
            <button
              className={`btn btn-primary btn-md ${input.length === 0 ? "btn-disabled" : ""}`} 
              disabled={input.length === 0}
              onClick={() => {
                onSendToClientPressed(input, activeClient);
                setInput("");
              }}
            >
              Send
            </button>
        </div>
      }
    </div>
  )
}

export default ActiveClient;