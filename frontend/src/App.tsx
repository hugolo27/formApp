import { Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box, IconButton, useTheme, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import FormBuilder from './components/FormBuilder';
import FormDisplay from './components/FormDisplay';
import SavedForms from './components/SavedForms';
import SourceDataDisplay from './components/SourceDataDisplay';
import { useState } from 'react';
import { APP_NAME, THEME } from './config';

function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const navButtons = (
    <>
      <Button 
        color="inherit" 
        component={Link} 
        to="/"
        sx={{ 
          color: '#fff',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          }
        }}
      >
        Home
      </Button>
      <Button 
        color="inherit" 
        component={Link} 
        to="/forms"
        sx={{ 
          color: '#fff',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          }
        }}
      >
        Saved Forms
      </Button>
    </>
  );

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: THEME.primaryColor }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {APP_NAME}
          </Typography>
          
          {isMobile ? (
            <>
              <IconButton
                color="inherit"
                aria-label="open menu"
                edge="end"
                onClick={toggleMobileMenu}
                sx={{ color: '#fff' }}
              >
                <MenuIcon />
              </IconButton>
              {mobileMenuOpen && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    backgroundColor: THEME.primaryColor,
                    display: 'flex',
                    flexDirection: 'column',
                    zIndex: 1000,
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                  }}
                >
                  {navButtons}
                </Box>
              )}
            </>
          ) : (
            navButtons
          )}
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4, px: { xs: 2, sm: 3, md: 4 }, maxWidth: THEME.maxWidth }}>
        <Routes>
          <Route path="/" element={<FormBuilder />} />
          <Route path="/forms" element={<SavedForms />} />
          <Route path="/form/:id" element={<FormDisplay />} />
          <Route path="/form/:id/submissions" element={<SourceDataDisplay />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;