import Input from "./Input.jsx";
import Output from "./Output.jsx";

function App() {
  return (
    <div className="container mx-auto p-4 bg-base-200 h-screen flex flex-col">
      <div className="mb-2 text-center">
        <p>NOT CONNECTED</p>
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
        <button className="btn-primary btn-wide btn-md mr-8">Connect</button>
        <button className="btn-primary btn-disabled btn-wide btn-md" disabled={true}>Disconnect</button>
      </div>
    </div>
  )
}

export default App;
