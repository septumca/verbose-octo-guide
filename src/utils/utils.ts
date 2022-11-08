import { RefObject, SyntheticEvent, useEffect, useState } from "react";
import { TIME_FORMAT, TIME_FORMAT_PRETTY } from "../components/Input/Input";
import moment from "moment";
import { useQueryClient } from "@tanstack/react-query";


export type GetFormDataOptions = {
  removeEmptyString?: boolean,
}

export const getSynthenticEventFormData = (event: SyntheticEvent): { [x: string]: { value: string }} => {
  return event.target as typeof event.target & {
    [x: string]: { value: string };
  };
}

export function getFormData(formData: any, options?: GetFormDataOptions): any {
  const data = Object.fromEntries(formData);
  if (options?.removeEmptyString) {
    removeEmptyStrings(data);
  }
  return data;
}

export function removeEmptyStrings(obj: any) {
  Object.keys(obj).forEach(k => {
    if (obj[k] === '') {
      delete obj[k];
    }
  });
}

export const useInputData = (initData: {[x: string]: any }) => {
  const [data, setData] = useState(initData);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    setData(d => ({
      ...d,
      [event.target.name]: event.target.value
    }));
  };

  return {
    data,
    handleInputChange,
    setData
  };
}

export const useToggler = (initValue: boolean): [boolean, () => void] => {
  const [val, setVal] = useState(initValue);
  const toggle = () => { setVal(v => !v); };
  return [val, toggle];
}

type DebouncedTimeout<T> = (data: T) => void;
export const useDebouncedChanges = <T>(
  delay: number,
  initialData: T,
  onTimeout: DebouncedTimeout<T>,
) => {
  const [data, setData] = useState(initialData);

  const update = (data: T) => {
    setData(d => ({ ...d, ...data }));
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const handler = setTimeout(() => { onTimeout(data); }, delay);
    return () => { clearTimeout(handler); };
  }, [data]);

  return {
    data,
    update
  };
}

export const timeToStr = (time: number) => moment.unix(time).format(TIME_FORMAT);
export const timeToStrPretty = (time: number) => moment.unix(time).format(TIME_FORMAT_PRETTY);

export const useMutatorSuccess = <T>(QUERY_TAG: string[]) => {
  const qc = useQueryClient();

  return (mutator: (d: T) => T) => {
    qc.setQueryData<T>(QUERY_TAG, d => {
      if (d !== undefined) {
        return mutator(d)
      }
      return d;
    })
  };
}

//based on https://usehooks.com/useOnClickOutside/
export const useOnClickOutside = (ref: RefObject<HTMLElement>, handler: (event?: MouseEvent) => void) => {
  useEffect(
    () => {
      const listener = (event: any) => {
        // Do nothing if clicking ref's element or descendent elements
        if (!ref.current || ref.current.contains(event.target)) {
          return;
        }
        handler(event);
      };
      document.addEventListener("mousedown", listener);
      document.addEventListener("touchstart", listener);
      return () => {
        document.removeEventListener("mousedown", listener);
        document.removeEventListener("touchstart", listener);
      };
    },
    [ref, handler]
  );
}
