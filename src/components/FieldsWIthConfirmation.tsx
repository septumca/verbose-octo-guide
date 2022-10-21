import { useRef, useState } from "react";
import "./Components.css";

type UserToolbarInfo = {
  label: string,
  placeholder?: string,
  required?: boolean,
  readonly?: boolean;
  value: string,
  onSetValue: (data: string) => void,
}

export function Input({ label, placeholder, required, value, onSetValue }: UserToolbarInfo) {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const handleConfirm = () => {
    const value = inputRef.current?.value;
    if (value !== undefined) {
      onSetValue(value);
      toggleEditing();
    }
  }
  const toggleEditing = () => {
    setEditing(e => !e);
  }

  if (!editing) {
    return (
      <div className="input-container">
        <div>{label}</div>
        <div>{value}</div>
        <div><button onClick={toggleEditing}>Edit</button></div>
      </div>
    )
  }

  return (
    <div className="input-container">
      <div>{label}</div>
      <input
        ref={inputRef}
        placeholder={placeholder}
        aria-label={label}
        type="text"
        required={required}
        defaultValue={value}
      />
      <div><button onClick={handleConfirm}>Confirm</button></div>
      <div><button onClick={toggleEditing}>Cancel</button></div>
    </div>
  )
}

export function TextArea({ label, placeholder, required, value, onSetValue }: UserToolbarInfo) {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const handleConfirm = () => {
    const value = inputRef.current?.value;
    if (value !== undefined) {
      onSetValue(value);
      toggleEditing();
    }
  }
  const toggleEditing = () => {
    setEditing(e => !e);
  }

  if (!editing) {
    return (
      <div className="input-container">
        <div>{label}</div>
        <div>{value}</div>
        <div><button onClick={toggleEditing}>Edit</button></div>
      </div>
    )
  }

  return (
    <div className="input-container">
      <div>{label}</div>
      <textarea
        ref={inputRef}
        placeholder={placeholder}
        aria-label={label}
        rows={6}
        required={required}
        defaultValue={value}
      />
      <div><button onClick={handleConfirm}>Confirm</button></div>
      <div><button onClick={toggleEditing}>Cancel</button></div>
    </div>
  )
}
