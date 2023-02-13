function Input() {
  return (
    <div className="mr-8">
      <div className="flex mb-2">
        <input className="input w-full rounded-none" type="text" placeholder="Input for Application1"/>
        <button className="btn-primary btn-disabled btn-md" disabled={true}>Send</button>
      </div>
      <div>
        <p>Input send:</p>
      </div>
    </div>
  )
}

export default Input;