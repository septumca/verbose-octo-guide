import { SyntheticEvent, useEffect, useState } from "react";

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
    handleInputChange
  };
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
