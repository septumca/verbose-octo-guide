import { useEffect, useRef } from "react";
import { useToggler } from "../utils/utils";
import { IconButton } from "./Buttons";
type InputProps = {
  label: string,
  placeholder?: string,
  required?: boolean,
  readonly?: boolean;
  value: string,
  onSetValue: (data: string) => void,
}

function InputLabel({ children }: any) {
  return <div className="text-base leading-7 text-blueGray-500">{children}</div>
}

export function Input({ label, placeholder, required, readonly, value, onSetValue }: InputProps) {
  const [editing, toggleEditing] = useToggler(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const handleConfirm = () => {
    const newValue = inputRef.current?.value;
    if (newValue === undefined) {
      return;
    }
    toggleEditing();
    if (newValue === value) {
      return;
    }
    onSetValue(newValue)
  }

  useEffect(() => {
    if (editing && inputRef.current !== null) {
      inputRef.current.focus();
    }
  }, [editing]);


  if (!editing) {
    return (
      <div className="flex">
        <InputLabel>{value}</InputLabel>
        {!readonly && <div className="ml-2">
          <IconButton onClick={toggleEditing}>⚙️</IconButton>
        </div>}
      </div>
    );
  }

  return (
    <div >
      <div className="flex">
        <div>
          <InputLabel>{label}</InputLabel>
        </div>
        <div className="ml-2">
          {editing && <IconButton title="confirm" onClick={handleConfirm}>✔️</IconButton>}
        </div>
        <div className="ml-2">
          {editing && <IconButton title="close" onClick={toggleEditing}>❌</IconButton>}
        </div>
      </div>
      <input
        className="w-full p-2 mr-4 mt-2 text-base text-black transition duration-500 ease-in-out transform rounded-md border focus:border-blueGray-500 focus:bg-white focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2"
        ref={inputRef}
        placeholder={placeholder}
        aria-label={label}
        type="text"
        required={required}
        defaultValue={value}
        disabled={!editing}
      />

    </div>
  )
}

export function TextArea({ label, placeholder, required, value, readonly, onSetValue }: InputProps) {
  const [editing, toggleEditing] = useToggler(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const handleConfirm = () => {
    const newValue = inputRef.current?.value;
    if (newValue === undefined) {
      return;
    }
    toggleEditing();
    if (newValue === value) {
      return;
    }
    onSetValue(newValue)
  }

  const handleInputClick = () => {
    if (!readonly && !editing) {
      toggleEditing();
    }
  }

  useEffect(() => {
    if (editing && inputRef.current !== null) {
      inputRef.current.focus();
    }
  }, [editing]);

  return (
    <div>
      <div className="flex mt-1">
        <InputLabel>{label}</InputLabel>
        {editing && <div className="ml-2"><IconButton title="confirm" onClick={handleConfirm}>✔️</IconButton></div>}
        {editing && <div className="ml-2"><IconButton title="close" onClick={toggleEditing}>❌</IconButton></div>}
        {!readonly && !editing && <div className="ml-2"><IconButton onClick={handleInputClick}>⚙️</IconButton></div>}
      </div>
      <textarea
        className="w-full h-32 p-2 mt-2 text-base text-blueGray-500 transition duration-500 ease-in-out transform bg-white border rounded-lg focus:border-blue-500 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 apearance-none autoexpand"
        ref={inputRef}
        placeholder={placeholder}
        aria-label={label}
        rows={6}
        required={required}
        defaultValue={value}
        disabled={!editing}
      />
    </div>
  )
}
