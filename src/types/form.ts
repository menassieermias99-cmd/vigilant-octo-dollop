export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "select"
  | "checkbox"
  | "rating";

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[]; //for 'select' dropdowns
}

export interface FormSchema {
  id: string;
  title: string;
  description?: string;
  published: boolean;
  fields: FormField[];
}
