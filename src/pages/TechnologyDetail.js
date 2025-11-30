import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useNotification } from '../components/Notification';
import DeadlineSetter from '../components/DeadLineSetter';
import './TechnologyDetail.css';

function TechnologyDetail() {
  const { techId } = useParams();
  const [technology, setTechnology] = useState(null);
  const { showNotification } = useNotification();

  useEffect(() => {
    const saved = localStorage.getItem('techTrackerData');
    if (saved) {
      const technologies = JSON.parse(saved);
      const tech = technologies.find(t => t.id === parseInt(techId));
      setTechnology(tech);
    }
  }, [techId]);

  const updateStatus = (newStatus) => {
    const saved = localStorage.getItem('techTrackerData');
    if (saved) {
      const technologies = JSON.parse(saved);
      const updated = technologies.map(tech =>
        tech.id === parseInt(techId) ? { ...tech, status: newStatus } : tech
      );
      localStorage.setItem('techTrackerData', JSON.stringify(updated));
      setTechnology(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const updateNotes = (techId, notes) => {
    const saved = localStorage.getItem('techTrackerData');
    if (saved) {
      const technologies = JSON.parse(saved);
      const updated = technologies.map(tech =>
        tech.id === techId ? { ...tech, notes } : tech
      );
      localStorage.setItem('techTrackerData', JSON.stringify(updated));
      setTechnology(prev => prev ? { ...prev, notes } : null);
      showNotification('Заметка сохранена', 'success');
    }
  };

  const updateDeadline = (techId, deadline) => {
    const saved = localStorage.getItem('techTrackerData');
    if (saved) {
      const technologies = JSON.parse(saved);
      const updated = technologies.map(tech =>
        tech.id === techId ? { ...tech, deadline } : tech
      );
      localStorage.setItem('techTrackerData', JSON.stringify(updated));
      setTechnology(prev => prev ? { ...prev, deadline } : null);
    }
  };

  if (!technology) {
    return (
      <div className="page">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Загрузка технологии...</p>
          <Link to="/technologies" className="btn">
            ← Назад к списку
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <Link to="/technologies" className="back-link">
          ← Назад к списку
        </Link>
        <h1>{technology.title}</h1>
      </div>

      <div className="technology-detail">
        <div className="detail-section">
          <h3>Описание</h3>
          <p>{technology.description}</p>
        </div>

        <div className="detail-section">
          <h3>Статус изучения</h3>
          <div className="status-buttons">
            <button
              onClick={() => updateStatus('not-started')}
              className={technology.status === 'not-started' ? 'active' : ''}
            >
              Не начато
            </button>
            <button
              onClick={() => updateStatus('in-progress')}
              className={technology.status === 'in-progress' ? 'active' : ''}
            >
              В процессе
            </button>
            <button
              onClick={() => updateStatus('completed')}
              className={technology.status === 'completed' ? 'active' : ''}
            >
              Завершено
            </button>
          </div>
        </div>

        <div className="detail-section">
          <h3>Срок изучения</h3>
          <DeadlineSetter 
            technology={technology}
            onDeadlineSet={updateDeadline}
          />
        </div>

        <div className="detail-section">
          <h3>Мои заметки</h3>
          <textarea
            value={technology.notes || ''} 
            onChange={(e) => updateNotes(technology.id, e.target.value)}
            placeholder="Добавьте заметки по изучению этой технологии..."
            rows="4"
            className="notes-textarea"
          />
          <div className="notes-hint">
            {technology.notes ? 
              `Заметка сохранена (${technology.notes.length} символов)` : 
              'Добавьте заметку'}
          </div>
        </div>

        {technology.category && (
          <div className="detail-section">
            <h3>Категория</h3>
            <p>{technology.category}</p>
          </div>
        )}

        {technology.difficulty && (
          <div className="detail-section">
            <h3>Уровень сложности</h3>
            <p>{technology.difficulty}</p>
          </div>
        )}

        {technology.tags && technology.tags.length > 0 && (
          <div className="detail-section">
            <h3>Теги</h3>
            <div className="tags-container">
              {technology.tags.map((tag, index) => (
                <span key={index} className="tag">{tag}</span>
              ))}
            </div>
          </div>
        )}

        {technology.resources && technology.resources.length > 0 && (
          <div className="detail-section">
            <h3>Ресурсы для изучения</h3>
            <ul className="resources-list">
              {technology.resources.map((resource, index) => (
                <li key={index}>{resource}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default TechnologyDetail;