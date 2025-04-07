import axios from 'axios';
import { Form, SourceRecord, FormAnswer } from '../types/form';
import { API_URL } from '../config';

export const api = {
  createForm: (form: Form) => 
    axios.post(`${API_URL}/forms`, form),
  
  getForm: (id: string) => 
    axios.get(`${API_URL}/forms/${id}`),
  
  getForms: () =>
    axios.get(`${API_URL}/forms`),

  createSourceRecord: (record: Omit<SourceRecord, 'id'>) => 
    axios.post(`${API_URL}/source-records`, record),
    
  getSourceRecordsByFormId: (formId: string) =>
    axios.get(`${API_URL}/source-records/form/${formId}`),

  submitForm: (formId: string, answers: FormAnswer[]) => {
    const sourceRecord: Omit<SourceRecord, 'id'> = {
      formId,
      answers
    };
    return api.createSourceRecord(sourceRecord);
  }
}; 