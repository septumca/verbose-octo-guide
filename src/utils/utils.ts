export type GetFormDataOptions = {
  removeEmptyString?: boolean,
}

export async function getFormData(request: any, options?: GetFormDataOptions): Promise<any> {
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  if (options?.removeEmptyString) {
    Object.keys(updates).forEach(k => {
      if (updates[k] === '') {
        delete updates[k];
      }
    });
  }
  return updates;
}
