import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddTechnology.css';

function AddTechnology() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'frontend',
    status: 'not-started',
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Получаем существующие технологии
    const existingTech = JSON.parse(localStorage.getItem('techTrackerData') || '[]');
    
    // Создаем новую технологию
    const newTechnology = {
      id: Date.now(), // Простой ID на основе времени
      ...formData,
      createdAt: new Date().toISOString()
    };
    
    // Добавляем в массив
    const updatedTech = [...existingTech, newTechnology];
    
    // Сохраняем
    localStorage.setItem('techTrackerData', JSON.stringify(updatedTech));
    
    // Показываем уведомление и перенаправляем
    alert('Технология успешно добавлена!');
    navigate('/technologies');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>➕ Добавить технологию</h1>
      </div>

      <form onSubmit={handleSubmit} className="technology-form">
        <div className="form-group">
          <label htmlFor="title">Название технологии *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Например: React Hooks, Node.js, MongoDB..."
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Описание *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Опишите что вы планируете изучить..."
            rows="4"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Категория</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="database">Базы данных</option>
              <option value="devops">DevOps</option>
              <option value="mobile">Мобильная разработка</option>
              <option value="tools">Инструменты</option>
              <option value="other">Другое</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="status">Начальный статус</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="not-started">Не начато</option>
              <option value="in-progress">В процессе</option>
              <option value="completed">Завершено</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="notes">Заметки (необязательно)</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Дополнительные заметки, ресурсы для изучения..."
            rows="3"
          />
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => navigate('/technologies')}
          >
            Отмена
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
          >
            Добавить технологию
          </button>
        </div>
      </form>

      <div className="form-preview">
        <h3>Предпросмотр:</h3>
        <div className="preview-card">
          <div className={`preview-status status-${formData.status}`}>
            {formData.status === 'completed' ? '✅ Завершено' : 
             formData.status === 'in-progress' ? '🔄 В процессе' : '⭕ Не начато'}
          </div>
          <h4>{formData.title || 'Название технологии'}</h4>
          <p>{formData.description || 'Описание технологии'}</p>
          <div className="preview-meta">
            <span className="category-badge">{formData.category}</span>
            {formData.notes && (
              <span className="notes-indicator">📝 Есть заметки</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddTechnology;