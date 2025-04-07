import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, 
  IconButton, Snackbar, Alert, FormControl,
   InputLabel, Select, MenuItem, FormControlLabel, Switch, Chip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { api } from '../services/api';
import { THEME } from '../config';
import { Form, FormField, FieldType } from '../types/form';

const FormBuilder = () => {
  const [name, setName] = useState('');
  const [fields, setFields] = useState<FormField[]>([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newOption, setNewOption] = useState('');
  const navigate = useNavigate();

  const addField = () => {
    const newField: FormField = {
      id: Date.now().toString(),
      question: '',
      type: 'text',
      required: false,
      options: [],
      min: 0,
      max: 10,
      placeholder: ''
    };
    setFields([...fields, newField]);
  };

  const removeField = (id: string) => {
    setFields(fields.filter(field => field.id !== id));
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map(field => 
      field.id === id ? { ...field, ...updates } : field
    ));
  };

  const addOption = (fieldId: string) => {
    if (!newOption.trim()) return;
    
    setFields(fields.map(field => {
      if (field.id === fieldId) {
        return {
          ...field,
          options: [...(field.options || []), newOption.trim()]
        };
      }
      return field;
    }));
    
    setNewOption('');
  };

  const removeOption = (fieldId: string, optionIndex: number) => {
    setFields(fields.map(field => {
      if (field.id === fieldId) {
        const newOptions = [...(field.options || [])];
        newOptions.splice(optionIndex, 1);
        return {
          ...field,
          options: newOptions
        };
      }
      return field;
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (fields.length === 0) {
      setError('Please add at least one field to the form');
      return;
    }
    
    try {
      const form: Form = {
        name,
        fields: fields.reduce((acc, field) => ({
          ...acc,
          [field.id]: {
            question: field.question,
            type: field.type,
            required: field.required,
            options: field.options,
            min: field.min,
            max: field.max,
            placeholder: field.placeholder
          }
        }), {})
      };
      
      await api.createForm(form);
      setSuccess(true);
      setTimeout(() => {
        navigate('/forms');
      }, THEME.snackbarDuration);
    } catch (err) {
      setError('Failed to create form');
    }
  };

  const renderFieldOptions = (field: FormField) => {
    if (field.type !== 'select' && field.type !== 'radio') return null;
    
    return (
      <Box sx={{ mt: 1, mb: 2 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Options:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
          {field.options?.map((option, index) => (
            <Chip 
              key={index} 
              label={option} 
              onDelete={() => removeOption(field.id, index)}
              color="primary"
              variant="outlined"
            />
          ))}
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            size="small"
            placeholder="Add option"
            value={newOption}
            onChange={(e) => setNewOption(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addOption(field.id);
              }
            }}
          />
          <Button 
            variant="outlined" 
            size="small"
            onClick={() => addOption(field.id)}
          >
            Add
          </Button>
        </Box>
      </Box>
    );
  };

  const renderFieldSettings = (field: FormField) => {
    switch (field.type) {
      case 'number':
      case 'rating':
        return (
          <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
            <TextField
              size="small"
              type="number"
              label="Min"
              value={field.min || 0}
              onChange={(e) => updateField(field.id, { min: Number(e.target.value) })}
              sx={{ width: '100px' }}
            />
            <TextField
              size="small"
              type="number"
              label="Max"
              value={field.max || 10}
              onChange={(e) => updateField(field.id, { max: Number(e.target.value) })}
              sx={{ width: '100px' }}
            />
          </Box>
        );
      case 'text':
      case 'textarea':
      case 'email':
        return (
          <TextField
            size="small"
            label="Placeholder"
            value={field.placeholder || ''}
            onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
            sx={{ mt: 1, width: '100%' }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ maxWidth: THEME.maxWidth, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Create New Form
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Form Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          sx={{ mb: 3 }}
        />
        
        {fields.map((field) => (
          <Box key={field.id} sx={{ mb: 3, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
              <TextField
                fullWidth
                label="Question"
                value={field.question}
                onChange={(e) => updateField(field.id, { question: e.target.value })}
                required
                sx={{ flexGrow: 1, minWidth: '200px' }}
              />
              <FormControl sx={{ minWidth: '150px' }}>
                <InputLabel>Type</InputLabel>
                <Select
                  value={field.type}
                  label="Type"
                  onChange={(e) => updateField(field.id, { type: e.target.value as FieldType })}
                >
                  <MenuItem value="text">Text</MenuItem>
                  <MenuItem value="textarea">Text Area</MenuItem>
                  <MenuItem value="datetime">Date/Time</MenuItem>
                  <MenuItem value="boolean">Yes/No</MenuItem>
                  <MenuItem value="email">Email</MenuItem>
                  <MenuItem value="number">Number</MenuItem>
                  <MenuItem value="select">Dropdown</MenuItem>
                  <MenuItem value="radio">Radio Buttons</MenuItem>
                  <MenuItem value="rating">Rating</MenuItem>
                  <MenuItem value="file">File Upload</MenuItem>
                </Select>
              </FormControl>
              <FormControlLabel
                control={
                  <Switch
                    checked={field.required}
                    onChange={(e) => updateField(field.id, { required: e.target.checked })}
                    color="primary"
                  />
                }
                label="Required"
              />
              <IconButton onClick={() => removeField(field.id)} color="error">
                <DeleteIcon />
              </IconButton>
            </Box>
            
            {renderFieldOptions(field)}
            {renderFieldSettings(field)}
          </Box>
        ))}
        
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Button
            variant="outlined"
            onClick={addField}
            startIcon={<AddIcon />}
            sx={{ mr: 2 }}
          >
            Add Field
          </Button>
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
            Create Form
          </Button>
        </Box>
      </form>
      
      <Snackbar
        open={success}
        autoHideDuration={THEME.snackbarDuration}
        onClose={() => setSuccess(false)}
      >
        <Alert severity="success">Form created successfully!</Alert>
      </Snackbar>
      <Snackbar
        open={!!error}
        autoHideDuration={THEME.snackbarDuration}
        onClose={() => setError(null)}
      >
        <Alert severity="error">{error}</Alert>
      </Snackbar>
    </Box>
  );
};

export default FormBuilder; 