import { useState } from "react";
import EnterInput from "./inputs/EnterInput";

function ActiveClient({activeClient, onSendToClientPressed}) {
  const [isOpen, setOpen] = useState(false);
  const [input, setInput] = useState("");

  const doSend = () => {
    onSendToClientPressed(input, activeClient);
    setInput("");
  }

  return (
    <div className="my-4">
      <button className={`btn btn-wide w-full ${!isOpen ? "btn-primary" : ""}`} onClick={() => setOpen(!isOpen)}>
        <p className="break-word">{`Client Id: ${activeClient}`}</p>
      </button>
      {isOpen && 
        <div className="flex">
          <EnterInput 
            styling={"w-full"}
            type="text"
            placeholder={`Input for ${activeClient}`}
            value={input}
            onValueChange={setInput}
            onEnter={doSend}
          />
          <button
            className={`btn btn-primary btn-md ${input.length === 0 ? "btn-disabled" : ""}`} 
            disabled={input.length === 0}
            onClick={doSend}
          >
            Send
          </button>
        </div>
      }
    </div>
  )
}

export default ActiveClient;