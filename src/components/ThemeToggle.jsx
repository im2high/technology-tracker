import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';

function ThemeToggle({ darkMode, onToggle }) {
  return (
    <Tooltip title={darkMode ? "Светлая тема" : "Темная тема"}>
      <IconButton
        onClick={onToggle}
        color="inherit"
        sx={{
          ml: 1,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'rotate(180deg)',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
        }}
      >
        {darkMode ? (
          <Brightness7 sx={{ color: 'yellow' }} />
        ) : (
          <Brightness4 />
        )}
      </IconButton>
    </Tooltip>
  );
}

export default ThemeToggle;