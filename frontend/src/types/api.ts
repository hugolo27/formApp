import { Form, FormField } from './form';

export interface SourceData {
  id: string;
  question: string;
  answer: string;
  sourceRecordId: string;
}

export interface SourceRecordResponse {
  id: string;
  formId: string;
  sourceData: SourceData[];
}

export interface FormResponse {
  id: string;
  name: string;
  fields: string | Record<string, any>;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
} 