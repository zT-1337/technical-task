function EnterInput({
  styling,
  type,
  placeholder,
  value,
  onValueChange,
  onEnter,
  isDisabled
}) {
  return (
    <input 
      className={`input rounded-none ${styling}`}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={event => onValueChange(event.target.value)}
      onKeyDown={event => {
        if(event.key === "Enter" && value.length > 0) {
          onEnter();
        }
      }}
      disabled={isDisabled}
    />
  )
}

export default EnterInput;