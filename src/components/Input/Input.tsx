import { useEffect, useRef } from "react";
import { useToggler } from "../../utils/utils";
import { Button } from "../Button/Button";

type ValueSetter = (data: string) => void;
export const TIME_FORMAT = 'YYYY-MM-DDTHH:mm';
export const TIME_FORMAT_PRETTY = 'D.M. YYYY HH:mm'

function useSetupInput<T extends HTMLInputElement | HTMLTextAreaElement>(value: string, onSetValue: ValueSetter): [boolean, React.RefObject<T>, VoidFunction, VoidFunction, VoidFunction] {
  const [editing, toggleEditing] = useToggler(false);
  const inputRef = useRef<T>(null);
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
  const handleCancel = () => {
    if (inputRef.current !== null) {
      inputRef.current.value = value;
    }
    toggleEditing();
  }

  useEffect(() => {
    if (editing && inputRef.current !== null) {
      inputRef.current.focus();
    }
  }, [editing]);

  return [editing, inputRef, toggleEditing, handleConfirm, handleCancel];
}

export type InputProps = {
  label: string,
  type?: string,
  placeholder?: string,
  required?: boolean,
  readonly?: boolean;
  value: string,
  displayValue?: string,
  onSetValue: ValueSetter,
}

function InputLabel({ children }: any) {
  return <div className="text-base leading-7 text-blueGray-500">{children}</div>
}

export function Input({ className, forwardRef, ...props }: any) {
  return <input
    className={`p-2 mr-4 mt-2 text-base text-black transition duration-500 ease-in-out transform rounded-md border focus:border-blueGray-500 focus:bg-white focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ${className ?? ''}`}
    ref={forwardRef}
    { ...props }
  />
}

export function InputWithControls({ label, displayValue, placeholder, required, type="text", readonly=false, value, onSetValue }: InputProps) {
  const [ editing, inputRef, toggleEditing, handleConfirm, handleCancel ] = useSetupInput<HTMLInputElement>(value, onSetValue);
  const _displayValue = displayValue ?? value;

  if (!editing) {
    return (
      <div className="flex">
        <InputLabel>{_displayValue}</InputLabel>
        {!readonly && <div className="ml-2"><Button onClick={toggleEditing}>⚙️</Button></div>}
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
          {editing && <Button title="confirm" onClick={handleConfirm}>✔️</Button>}
        </div>
        <div className="ml-2">
          {editing && <Button title="close" onClick={handleCancel}>❌</Button>}
        </div>
      </div>
      <Input
        className="w-full"
        forwardRef={inputRef}
        type={type}
        placeholder={placeholder}
        aria-label={label}
        required={required}
        defaultValue={value}
        disabled={!editing}
      />

    </div>
  )
}

export function TextArea({ className, forwardRef, ...props }: any) {
  return <textarea
    className={`h-32 p-2 mt-2 text-base text-blueGray-500 transition duration-500 ease-in-out transform bg-white border rounded-lg focus:border-blue-500 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 apearance-none autoexpand ${className ?? ''}`}
    ref={forwardRef}
    { ...props }
  />
}

export function TextAreaWithControls({ label, placeholder, required, value, readonly, onSetValue }: InputProps) {
  const [ editing, inputRef, toggleEditing, handleConfirm, handleCancel ] = useSetupInput<HTMLTextAreaElement>(value, onSetValue);

  return (
    <div>
      <div className="flex mt-1">
        <InputLabel>{label}</InputLabel>
        {editing && <div className="ml-2"><Button title="confirm" onClick={handleConfirm}>✔️</Button></div>}
        {editing && <div className="ml-2"><Button title="close" onClick={handleCancel}>❌</Button></div>}
        {!readonly && !editing && <div className="ml-2"><Button onClick={toggleEditing}>⚙️</Button></div>}
      </div>
      <TextArea
        className="w-full"
        forwardRef={inputRef}
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
