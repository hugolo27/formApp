import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, TextField, Button, FormControlLabel, Switch, Snackbar, Alert, FormControl, InputLabel, Select, MenuItem, Radio, RadioGroup, Rating } from '@mui/material';
import { api } from '../services/api';
import { THEME } from '../config';
import { Form, FormField, FormAnswer } from '../types/form';

const FormDisplay = () => {
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<Form | null>(null);
  const [answers, setAnswers] = useState<FormAnswer[]>([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dataFetchedRef = useRef(false);

  useEffect(() => {
    const fetchForm = async () => {
      if (dataFetchedRef.current) return;
      dataFetchedRef.current = true;
      
      try {
        const response = await api.getForm(id!);
        
        let formData;
        if (response.data && response.data.data) {
          formData = response.data.data;
        } else {
          formData = response.data;
        }
        
        setForm(formData);
        
        if (formData && formData.fields && typeof formData.fields === 'object') {
          setAnswers(Object.entries(formData.fields).map(([fieldId]) => ({
            fieldId,
            value: ''
          })));
        }
      } catch (err) {
        setError('Failed to load form');
      }
    };
    fetchForm();
  }, [id]);

  const handleAnswerChange = (fieldId: string, value: string | boolean | number) => {
    setAnswers(answers.map(answer => 
      answer.fieldId === fieldId ? { ...answer, value: String(value) } : answer
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.submitForm(id!, answers);
      setSuccess(true);
      setTimeout(() => {
        window.location.href = '/forms';
      }, THEME.snackbarDuration);
    } catch (err) {
      setError('Failed to submit form');
    }
  };

  const renderField = (fieldId: string, field: Omit<FormField, 'id'>) => {
    const answer = answers.find(a => a.fieldId === fieldId);
    const value = answer?.value ?? '';

    switch (field.type) {
      case 'textarea':
        return (
          <TextField
            fullWidth
            multiline
            rows={4}
            label={field.question}
            value={value}
            onChange={(e) => handleAnswerChange(fieldId, e.target.value)}
            required={field.required}
            placeholder={field.placeholder}
          />
        );
      case 'datetime':
        return (
          <TextField
            fullWidth
            type="datetime-local"
            label={field.question}
            value={value}
            onChange={(e) => handleAnswerChange(fieldId, e.target.value)}
            required={field.required}
            InputLabelProps={{ shrink: true }}
          />
        );
      case 'boolean':
        return (
          <FormControlLabel
            control={
              <Switch
                checked={value === 'true'}
                onChange={(e) => handleAnswerChange(fieldId, e.target.checked)}
                color="primary"
              />
            }
            label={field.question}
          />
        );
      case 'email':
        return (
          <TextField
            fullWidth
            type="email"
            label={field.question}
            value={value}
            onChange={(e) => handleAnswerChange(fieldId, e.target.value)}
            required={field.required}
            placeholder={field.placeholder}
          />
        );
      case 'number':
        return (
          <TextField
            fullWidth
            type="number"
            label={field.question}
            value={value}
            onChange={(e) => handleAnswerChange(fieldId, e.target.value)}
            required={field.required}
            inputProps={{
              min: field.min,
              max: field.max
            }}
          />
        );
      case 'select':
        return (
          <FormControl fullWidth required={field.required}>
            <InputLabel>{field.question}</InputLabel>
            <Select
              value={value}
              label={field.question}
              onChange={(e) => handleAnswerChange(fieldId, e.target.value)}
            >
              {field.options?.map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      case 'radio':
        return (
          <FormControl required={field.required}>
            <Typography variant="body1" gutterBottom>
              {field.question}
            </Typography>
            <RadioGroup
              value={value}
              onChange={(e) => handleAnswerChange(fieldId, e.target.value)}
            >
              {field.options?.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={option}
                  control={<Radio />}
                  label={option}
                />
              ))}
            </RadioGroup>
          </FormControl>
        );
      case 'rating':
        return (
          <Box>
            <Typography variant="body1" gutterBottom>
              {field.question}
            </Typography>
            <Rating
              value={Number(value) || 0}
              onChange={(_, newValue) => handleAnswerChange(fieldId, newValue || 0)}
              max={field.max || 5}
            />
          </Box>
        );
      case 'file':
        return (
          <Box>
            <input
              type="file"
              id={`file-${fieldId}`}
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleAnswerChange(fieldId, file.name);
                }
              }}
            />
            <label htmlFor={`file-${fieldId}`}>
              <Button
                variant="outlined"
                component="span"
                fullWidth
              >
                {field.question}
              </Button>
            </label>
          </Box>
        );
      default:
        return (
          <TextField
            fullWidth
            label={field.question}
            value={value}
            onChange={(e) => handleAnswerChange(fieldId, e.target.value)}
            required={field.required}
            placeholder={field.placeholder}
          />
        );
    }
  };

  if (!form) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ maxWidth: THEME.maxWidth, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {form.name}
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {form.fields && typeof form.fields === 'object' ? 
            Object.entries(form.fields).map(([fieldId, field]) => (
              <Box key={fieldId}>
                {renderField(fieldId, field)}
              </Box>
            ))
            : <Typography>No fields found in this form.</Typography>
          }
          <Button
            type="submit"
            variant="contained"
            sx={{
              bgcolor: THEME.primaryColor,
              '&:hover': {
                bgcolor: THEME.primaryColorHover,
              },
            }}
          >
            Submit
          </Button>
        </Box>
      </form>
      
      <Snackbar
        open={success}
        autoHideDuration={THEME.snackbarDuration}
        onClose={() => setSuccess(false)}
      >
        <Alert severity="success" onClose={() => setSuccess(false)}>
          Form submitted successfully!
        </Alert>
      </Snackbar>
      
      <Snackbar
        open={!!error}
        autoHideDuration={THEME.snackbarDuration}
        onClose={() => setError(null)}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FormDisplay; 