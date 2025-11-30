import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { lightTheme, darkTheme } from './styles/Theme';
import { NotificationProvider } from './components/Notification';
import Navigation from './components/Navigation';

import Home from './pages/Home';
import TechnologyList from './pages/TechnologyList';
import TechnologyDetail from './pages/TechnologyDetail';
import AddTechnology from './pages/AddTechnology';
import Statistics from './pages/Statistics';
import Settings from './pages/Settings';
import ApiIntegration from './pages/ApiIntegration';
import BulkManagement from './pages/BulkManagement';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const theme = useMemo(() => 
    darkMode ? darkTheme : lightTheme,
    [darkMode]
  );

  const toggleTheme = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NotificationProvider>
        <Router>
          <Box 
            sx={{ 
              minHeight: '100vh',
              backgroundColor: 'background.default',
              color: 'text.primary',
              transition: 'all 0.3s ease',
            }}
          >
            <Navigation darkMode={darkMode} onThemeToggle={toggleTheme} />
            
            <Box component="main" sx={{ p: 3 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/technologies" element={<TechnologyList />} />
                <Route path="/technology/:techId" element={<TechnologyDetail />} />
                <Route path="/add-technology" element={<AddTechnology />} />
                <Route path="/statistics" element={<Statistics />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/api-demo" element={<ApiIntegration />} />
                <Route path="/bulk-management" element={<BulkManagement />} />
              </Routes>
            </Box>
          </Box>
        </Router>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;