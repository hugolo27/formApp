export type FieldType = 'text' | 'textarea' | 'datetime' | 'boolean' | 'email' | 'number' | 'select' | 'radio' | 'rating' | 'file';

export interface FormField {
  id: string;
  question: string;
  type: FieldType;
  required: boolean;
  options?: string[];
  min?: number; 
  max?: number;
  placeholder?: string;
}

export interface Form {
  id?: string;
  name: string;
  fields: Record<string, Omit<FormField, 'id'>>;
  fieldsCount?: number;
}

export interface FormAnswer {
  fieldId: string;
  value: string;
}

export interface SourceRecord {
  id: string;
  formId: string;
  answers: FormAnswer[];
}