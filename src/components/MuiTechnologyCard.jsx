import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  LinearProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  PlayCircle as PlayCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
} from '@mui/icons-material';
import { useNotification } from '../context/NotificationContext';

function MuiTechnologyCard({ technology, onEdit, onDelete, onStatusChange }) {
  const { showNotification } = useNotification();

  const handleStatusChange = (newStatus) => {
    onStatusChange(technology.id, newStatus);
    const statusMessages = {
      'not-started': 'Статус изменен на "Не начато"',
      'in-progress': 'Начато изучение технологии',
      'completed': 'Технология изучена! Поздравляем!',
    };
    showNotification(statusMessages[newStatus], 'success');
  };

  const handleDelete = () => {
    if (window.confirm(`Удалить технологию "${technology.title}"?`)) {
      onDelete(technology.id);
      showNotification(`Технология "${technology.title}" удалена`, 'warning');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon color="success" />;
      case 'in-progress':
        return <PlayCircleIcon color="primary" />;
      default:
        return <RadioButtonUncheckedIcon color="disabled" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in-progress':
        return 'primary';
      default:
        return 'default';
    }
  };

  const getProgressValue = (status) => {
    switch (status) {
      case 'completed':
        return 100;
      case 'in-progress':
        return 50;
      default:
        return 0;
    }
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Typography variant="h6" component="h3" gutterBottom sx={{ flex: 1, mr: 1 }}>
            {technology.title}
          </Typography>
          {getStatusIcon(technology.status)}
        </Box>

        <Typography variant="body2" color="text.secondary" paragraph>
          {technology.description}
        </Typography>

        {technology.category && (
          <Chip
            label={technology.category}
            size="small"
            variant="outlined"
            sx={{ mb: 2 }}
          />
        )}

        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Прогресс изучения:
          </Typography>
          <LinearProgress
            variant="determinate"
            value={getProgressValue(technology.status)}
            color={getStatusColor(technology.status)}
            sx={{ height: 8, borderRadius: 4 }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
            {getProgressValue(technology.status)}%
          </Typography>
        </Box>
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
        <Box>
          <Chip
            label={technology.status === 'completed' ? 'Завершено' : 
                   technology.status === 'in-progress' ? 'В процессе' : 'Не начато'}
            color={getStatusColor(technology.status)}
            size="small"
            variant={technology.status === 'not-started' ? 'outlined' : 'filled'}
          />
        </Box>

        <Box>
          <Tooltip title="Изменить статус">
            <IconButton
              size="small"
              onClick={() => {
                const statusFlow = ['not-started', 'in-progress', 'completed'];
                const currentIndex = statusFlow.indexOf(technology.status);
                const nextIndex = (currentIndex + 1) % statusFlow.length;
                handleStatusChange(statusFlow[nextIndex]);
              }}
            >
              <PlayCircleIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Редактировать">
            <IconButton
              size="small"
              onClick={() => onEdit(technology)}
              color="primary"
            >
              <EditIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Удалить">
            <IconButton
              size="small"
              onClick={handleDelete}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </CardActions>
    </Card>
  );
}

export default MuiTechnologyCard;