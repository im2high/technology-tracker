import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box,
  useTheme,
  useMediaQuery 
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

function Navigation({ darkMode, onThemeToggle }) {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const navItems = [
    { path: '/', label: '🏠 Главная' },
    { path: '/technologies', label: '📚 Технологии' },
    { path: '/bulk-management', label: '⚡ Массовое управление' },
    { path: '/api-demo', label: '🔌 API Демо' },
    { path: '/statistics', label: '📊 Статистика' },
    { path: '/add-technology', label: '➕ Добавить' },
  ];

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography 
          variant="h6" 
          component={Link}
          to="/"
          sx={{ 
            flexGrow: isMobile ? 1 : 0,
            mr: 4,
            fontWeight: 700,
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          🚀 Трекер технологий
        </Typography>

        {!isMobile && (
          <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                component={Link}
                to={item.path}
                color="inherit"
                sx={{
                  fontWeight: location.pathname === item.path ? 700 : 400,
                  backgroundColor: location.pathname === item.path ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        )}

        <ThemeToggle darkMode={darkMode} onToggle={onThemeToggle} />

        {isMobile && (
          <Button 
            component={Link}
            to="/add-technology"
            color="inherit"
            variant="outlined"
            size="small"
            sx={{ ml: 1 }}
          >
            ➕
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navigation;