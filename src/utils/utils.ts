import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SyntheticEvent } from "react";

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
    Object.keys(data).forEach(k => {
      if (data[k] === '') {
        delete data[k];
      }
    });
  }
  return data;
}

export const useInvalidateMutation = (fetch: any, queryToInvalidate: string): any => {
  const queryClient = useQueryClient();
  const mutation = useMutation(fetch, {
    onSuccess: () => {
      queryClient.invalidateQueries([queryToInvalidate])
    },
  });
  return mutation;
}
