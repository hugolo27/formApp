import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, List, ListItem, ListItemText, Button, Paper, useTheme, useMediaQuery } from '@mui/material';
import { api } from '../services/api';
import { THEME } from '../config';
import { FormResponse } from '../types/api';
import { Form } from '../types/form';

const SavedForms = () => {
  const [forms, setForms] = useState<Form[]>([]);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await api.getForms();
        const formsData = response.data.data;
        
        // Process each form to count fields correctly
        const processedForms = formsData.map((form: FormResponse) => {
          const fieldsCount = typeof form.fields === 'object' ? Object.keys(form.fields).length : 0;
          return {
            ...form,
            fieldsCount
          };
        });
        
        setForms(processedForms);
      } catch (error) {
        console.error('Error fetching forms:', error);
      }
    };

    fetchForms();
  }, []);

  return (
    <Box sx={{ maxWidth: THEME.maxWidth, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Saved Forms
      </Typography>
      <List>
        {forms.map((form) => (
          <Paper key={form.id} sx={{ mb: 2 }}>
            <ListItem
              sx={{
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: isMobile ? 'flex-start' : 'center',
                gap: isMobile ? 2 : 0,
              }}
            >
              <ListItemText
                primary={form.name}
                secondary={`${form.fieldsCount || 0} fields`}
                sx={{ mb: isMobile ? 2 : 0 }}
              />
              <Box sx={{ display: 'flex', gap: 2, width: isMobile ? '100%' : 'auto' }}>
                <Button
                  variant="contained"
                  onClick={() => navigate(`/form/${form.id}`)}
                  fullWidth={isMobile}
                  sx={{
                    bgcolor: THEME.primaryColor,
                    '&:hover': {
                      bgcolor: THEME.primaryColorHover,
                    },
                  }}
                >
                  View Form
                </Button>
                <Button
                  variant="contained"
                  onClick={() => navigate(`/form/${form.id}/submissions`)}
                  fullWidth={isMobile}
                  sx={{
                    bgcolor: THEME.primaryColor,
                    '&:hover': {
                      bgcolor: THEME.primaryColorHover,
                    },
                  }}
                >
                  View Submissions
                </Button>
              </Box>
            </ListItem>
          </Paper>
        ))}
      </List>
    </Box>
  );
};

export default SavedForms; 