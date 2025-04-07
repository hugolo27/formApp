import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Paper } from '@mui/material';
import { api } from '../services/api';
import { THEME } from '../config';
import { SourceRecordResponse, SourceData } from '../types/api';

const SourceDataDisplay = () => {
  const { id } = useParams<{ id: string }>();
  const [sourceRecords, setSourceRecords] = useState<SourceRecordResponse[]>([]);
  const [formName, setFormName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dataFetchedRef = useRef(false);
  const currentIdRef = useRef<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    currentIdRef.current = id || null;
    
    const fetchData = async () => {
      if (!id || dataFetchedRef.current) return;
      dataFetchedRef.current = true;
      
      try {
        setLoading(true);
        setError(null);
        
        const recordsResponse = await api.getSourceRecordsByFormId(id);
        
        if (!isMounted || currentIdRef.current !== id) return;
        
        let records: SourceRecordResponse[] = [];
        if (recordsResponse.data && recordsResponse.data.data) {
          records = recordsResponse.data.data.sourceRecords || [];
        } else if (recordsResponse.data && Array.isArray(recordsResponse.data.sourceRecords)) {
          records = recordsResponse.data.sourceRecords;
        } else if (Array.isArray(recordsResponse.data)) {
          records = recordsResponse.data;
        }
        
        if (records.length > 0) {
          const formId = records[0].formId;
          
          const formResponse = await api.getForm(formId);
          
          if (!isMounted || currentIdRef.current !== id) return;
          
          let formData;
          if (formResponse.data && formResponse.data.data) {
            formData = formResponse.data.data;
          } else {
            formData = formResponse.data;
          }
          
          if (formData && formData.name) {
            setFormName(formData.name);
          } else {
            setFormName('Unnamed Form');
          }
          
          const fieldMap: Record<string, string> = {};
          
          if (formData && formData.fields && typeof formData.fields === 'object') {
            Object.entries(formData.fields).forEach(([fieldId, field]: [string, any]) => {
              if (field && typeof field === 'object' && field.question) {
                fieldMap[fieldId] = field.question;
              }
            });
          }
          
          const processedRecords = records.map((record: SourceRecordResponse) => ({
            ...record,
            sourceData: record.sourceData.map((data: SourceData) => {
              const questionText = fieldMap[data.question] || data.question;
              
              return {
                ...data,
                question: questionText
              };
            })
          }));
          
          setSourceRecords(processedRecords);
        } else {
          const formResponse = await api.getForm(id);
          
          if (!isMounted || currentIdRef.current !== id) return;
          
          let formData;
          if (formResponse.data && formResponse.data.data) {
            formData = formResponse.data.data;
          } else {
            formData = formResponse.data;
          }
          
          if (formData && formData.name) {
            setFormName(formData.name);
          } else {
            setFormName('Unnamed Form');
          }
          
          setSourceRecords([]);
        }
      } catch (err) {
        if (isMounted && currentIdRef.current === id) {
          setError('Failed to fetch data');
        }
      } finally {
        if (isMounted && currentIdRef.current === id) {
          setLoading(false);
        }
      }
    };

    fetchData();
    
    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    dataFetchedRef.current = false;
  }, [id]);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ maxWidth: THEME.maxWidth, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Form Submissions - {formName}
      </Typography>
      {!sourceRecords.length ? (
        <Typography>No submissions found for this form.</Typography>
      ) : (
        sourceRecords.map((record, index) => (
          <Paper key={record.id} sx={{ p: 3, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Submission {index + 1}
            </Typography>
            {record.sourceData.map((data) => (
              <Box key={data.id} sx={{ mb: 2 }}>
                <Typography variant="subtitle1" color="text.secondary">
                  {data.question}
                </Typography>
                <Typography>{data.answer}</Typography>
              </Box>
            ))}
          </Paper>
        ))
      )}
    </Box>
  );
};

export default SourceDataDisplay; 