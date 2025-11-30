import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../components/Notification';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Chip,
  Alert,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  FormHelperText,
} from '@mui/material';
import {
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
  Category as CategoryIcon,
  Description as DescriptionIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

function AddTechnology() {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'frontend',
    status: 'not-started',
    difficulty: 'beginner',
    notes: '',
    resources: [''],
    tags: [],
  });
  const [errors, setErrors] = useState({});
  const [customTag, setCustomTag] = useState('');

  const categories = [
    { value: 'frontend', label: 'Frontend', icon: '🎨' },
    { value: 'backend', label: 'Backend', icon: '⚙️' },
    { value: 'database', label: 'Базы данных', icon: '🗄️' },
    { value: 'devops', label: 'DevOps', icon: '🚀' },
    { value: 'mobile', label: 'Мобильная разработка', icon: '📱' },
    { value: 'ai-ml', label: 'AI/ML', icon: '🤖' },
    { value: 'tools', label: 'Инструменты', icon: '🛠️' },
    { value: 'other', label: 'Другое', icon: '📦' },
  ];

  const difficultyLevels = [
    { value: 'beginner', label: 'Начинающий', color: 'success' },
    { value: 'intermediate', label: 'Средний', color: 'warning' },
    { value: 'advanced', label: 'Продвинутый', color: 'error' },
    { value: 'expert', label: 'Эксперт', color: 'secondary' },
  ];

  const steps = [
    { label: 'Основная информация', icon: <DescriptionIcon /> },
    { label: 'Категория и сложность', icon: <CategoryIcon /> },
    { label: 'Дополнительные настройки', icon: <SettingsIcon /> },
  ];

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 0) {
      if (!formData.title.trim()) {
        newErrors.title = 'Название обязательно';
      } else if (formData.title.length > 50) {
        newErrors.title = 'Название не должно превышать 50 символов';
      }

      if (!formData.description.trim()) {
        newErrors.description = 'Описание обязательно';
      } else if (formData.description.length < 10) {
        newErrors.description = 'Описание должно содержать минимум 10 символов';
      }
    }

    if (step === 1) {
      if (!formData.category) {
        newErrors.category = 'Выберите категорию';
      }
      if (!formData.difficulty) {
        newErrors.difficulty = 'Выберите уровень сложности';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateStep(activeStep)) {
      try {
        const existingTech = JSON.parse(localStorage.getItem('techTrackerData') || '[]');
        
        const newTechnology = {
          id: Date.now(),
          ...formData,
          tags: formData.tags.filter(tag => tag.trim() !== ''),
          resources: formData.resources.filter(res => res.trim() !== ''),
          createdAt: new Date().toISOString(),
          progress: 0,
        };

        const updatedTech = [...existingTech, newTechnology];
        localStorage.setItem('techTrackerData', JSON.stringify(updatedTech));

        showNotification('Технология успешно добавлена!', 'success');
        navigate('/technologies');
      } catch (error) {
        showNotification('Ошибка при сохранении технологии', 'error');
        console.error('Error saving technology:', error);
      }
    }
  };

  const handleAddTag = () => {
    if (customTag.trim() && !formData.tags.includes(customTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, customTag.trim()]
      }));
      setCustomTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleAddResource = () => {
    setFormData(prev => ({
      ...prev,
      resources: [...prev.resources, '']
    }));
  };

  const handleResourceChange = (index, value) => {
    const newResources = [...formData.resources];
    newResources[index] = value;
    setFormData(prev => ({
      ...prev,
      resources: newResources
    }));
  };

  const handleRemoveResource = (index) => {
    setFormData(prev => ({
      ...prev,
      resources: prev.resources.filter((_, i) => i !== index)
    }));
  };

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Название технологии *"
              value={formData.title}
              onChange={handleInputChange('title')}
              error={!!errors.title}
              helperText={errors.title || 'Например: React, Node.js, MongoDB'}
              fullWidth
              variant="outlined"
            />
            
            <TextField
              label="Описание *"
              value={formData.description}
              onChange={handleInputChange('description')}
              error={!!errors.description}
              helperText={errors.description || 'Опишите, что представляет собой эта технология'}
              multiline
              rows={4}
              fullWidth
              variant="outlined"
            />
          </Box>
        );
      
      case 1:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <FormControl fullWidth error={!!errors.category}>
              <InputLabel>Категория *</InputLabel>
              <Select
                value={formData.category}
                label="Категория *"
                onChange={handleInputChange('category')}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat.value} value={cat.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <span>{cat.icon}</span>
                      <span>{cat.label}</span>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
              {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
            </FormControl>

            <FormControl fullWidth error={!!errors.difficulty}>
              <InputLabel>Уровень сложности *</InputLabel>
              <Select
                value={formData.difficulty}
                label="Уровень сложности *"
                onChange={handleInputChange('difficulty')}
              >
                {difficultyLevels.map((level) => (
                  <MenuItem key={level.value} value={level.value}>
                    {level.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.difficulty && <FormHelperText>{errors.difficulty}</FormHelperText>}
            </FormControl>

            <Alert severity="info">
              Уровень сложности поможет вам планировать время на изучение технологии
            </Alert>
          </Box>
        );
      
      case 2:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Заметки"
              value={formData.notes}
              onChange={handleInputChange('notes')}
              multiline
              rows={3}
              fullWidth
              variant="outlined"
              helperText="Дополнительные заметки или план изучения"
            />

            <Box>
              <Typography variant="h6" gutterBottom>
                Теги
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                {formData.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    onDelete={() => handleRemoveTag(tag)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  size="small"
                  value={customTag}
                  onChange={(e) => setCustomTag(e.target.value)}
                  placeholder="Добавить тег"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <Button 
                  variant="outlined" 
                  onClick={handleAddTag}
                  disabled={!customTag.trim()}
                >
                  Добавить
                </Button>
              </Box>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom>
                Ресурсы для изучения
              </Typography>
              {formData.resources.map((resource, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <TextField
                    size="small"
                    value={resource}
                    onChange={(e) => handleResourceChange(index, e.target.value)}
                    placeholder={`Ресурс ${index + 1} (URL или описание)`}
                    fullWidth
                  />
                  {formData.resources.length > 1 && (
                    <Button 
                      color="error" 
                      onClick={() => handleRemoveResource(index)}
                    >
                      Удалить
                    </Button>
                  )}
                </Box>
              ))}
              <Button 
                variant="outlined" 
                onClick={handleAddResource}
                startIcon={<AddIcon />}
              >
                Добавить ресурс
              </Button>
            </Box>
          </Box>
        );
      
      default:
        return 'Неизвестный шаг';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/technologies')}
          sx={{ mb: 2 }}
        >
          Назад к технологиям
        </Button>
        <Typography variant="h4" component="h1" gutterBottom>
          Добавить новую технологию
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Заполните информацию о технологии, которую хотите изучить
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel StepIconComponent={() => step.icon}>
                    <Typography variant="h6">{step.label}</Typography>
                  </StepLabel>
                  <StepContent>
                    {getStepContent(index)}
                    <Box sx={{ mb: 2, mt: 2 }}>
                      <div>
                        <Button
                          variant="contained"
                          onClick={index === steps.length - 1 ? handleSubmit : handleNext}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          {index === steps.length - 1 ? 'Добавить технологию' : 'Продолжить'}
                        </Button>
                        <Button
                          disabled={index === 0}
                          onClick={handleBack}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          Назад
                        </Button>
                      </div>
                    </Box>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
            
            {activeStep === steps.length && (
              <Alert severity="success" sx={{ mt: 2 }}>
                Все шаги завершены - технология готова к добавлению!
              </Alert>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Предпросмотр
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" color="primary" gutterBottom>
                  {formData.title || 'Название технологии'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formData.description || 'Описание технологии'}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {formData.category && (
                  <Chip
                    label={categories.find(c => c.value === formData.category)?.label || formData.category}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                )}
                {formData.difficulty && (
                  <Chip
                    label={difficultyLevels.find(d => d.value === formData.difficulty)?.label || formData.difficulty}
                    size="small"
                    color={difficultyLevels.find(d => d.value === formData.difficulty)?.color || 'default'}
                  />
                )}
              </Box>

              {formData.tags.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Теги:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                    {formData.tags.map((tag, index) => (
                      <Chip key={index} label={tag} size="small" variant="outlined" />
                    ))}
                  </Box>
                </Box>
              )}

              <Typography variant="caption" color="text.secondary">
                Статус: {formData.status === 'not-started' ? 'Не начато' : 
                        formData.status === 'in-progress' ? 'В процессе' : 'Завершено'}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                💡 Советы
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Будьте конкретны в названии<br/>
                • Добавляйте полезные ресурсы<br/>
                • Используйте теги для поиска<br/>
                • Указывайте реальный уровень сложности
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default AddTechnology;