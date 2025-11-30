import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useNotification } from '../components/Notification';
import './TechnologyList.css';

function TechnologyList() {
  const [technologies, setTechnologies] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { showNotification } = useNotification();

  useEffect(() => {
    const saved = localStorage.getItem('techTrackerData');
    if (saved) {
      setTechnologies(JSON.parse(saved));
    }
  }, []);

  const handleDelete = (techId, techTitle) => {
    if (window.confirm(`Удалить технологию "${techTitle}"?`)) {
      const updatedTech = technologies.filter(tech => tech.id !== techId);
      setTechnologies(updatedTech);
      localStorage.setItem('techTrackerData', JSON.stringify(updatedTech));
      showNotification(`Технология "${techTitle}" удалена`, 'warning');
    }
  };

  const handleStatusChange = (techId, newStatus) => {
    const updatedTech = technologies.map(tech =>
      tech.id === techId ? { ...tech, status: newStatus } : tech
    );
    setTechnologies(updatedTech);
    localStorage.setItem('techTrackerData', JSON.stringify(updatedTech));
    
    const statusMessages = {
      'not-started': 'Статус изменен на "Не начато"',
      'in-progress': 'Начато изучение технологии',
      'completed': 'Технология изучена! Поздравляем!',
    };
    showNotification(statusMessages[newStatus], 'success');
  };

  const filteredTechnologies = technologies.filter(tech => {
    const statusMatch = filter === 'all' || tech.status === filter;
    const searchMatch = !searchQuery || 
      tech.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tech.tags && tech.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    return statusMatch && searchMatch;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'in-progress':
        return '🔄';
      default:
        return '⭕';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed':
        return 'Завершено';
      case 'in-progress':
        return 'В процессе';
      default:
        return 'Не начато';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'status-completed';
      case 'in-progress':
        return 'status-in-progress';
      default:
        return 'status-not-started';
    }
  };

  const getProgressWidth = (status) => {
    switch (status) {
      case 'completed':
        return '100%';
      case 'in-progress':
        return '50%';
      default:
        return '0%';
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>📚 Все технологии</h1>
        <p>Управляйте вашим прогрессом изучения технологий</p>
        <Link to="/add-technology" className="btn btn-primary">
          + Добавить технологию
        </Link>
      </div>

      <div className="controls-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Поиск по названию, описанию или тегам..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Все
          </button>
          <button 
            className={`filter-btn ${filter === 'not-started' ? 'active' : ''}`}
            onClick={() => setFilter('not-started')}
          >
            ⭕ Не начатые
          </button>
          <button 
            className={`filter-btn ${filter === 'in-progress' ? 'active' : ''}`}
            onClick={() => setFilter('in-progress')}
          >
            🔄 В процессе
          </button>
          <button 
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            ✅ Завершенные
          </button>
        </div>
      </div>

      <div className="stats-overview">
        <div className="stat-item">
          <span className="stat-number">{technologies.length}</span>
          <span className="stat-label">Всего</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">
            {technologies.filter(t => t.status === 'completed').length}
          </span>
          <span className="stat-label">Завершено</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">
            {technologies.filter(t => t.status === 'in-progress').length}
          </span>
          <span className="stat-label">В процессе</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">
            {technologies.filter(t => t.status === 'not-started').length}
          </span>
          <span className="stat-label">Не начато</span>
        </div>
      </div>

      <div className="technologies-grid">
        {filteredTechnologies.map(tech => (
          <div key={tech.id} className="technology-card">
            <div className="card-header">
              <h3>{tech.title}</h3>
              <div className="card-actions">
                <button
                  onClick={() => handleStatusChange(tech.id, 
                    tech.status === 'not-started' ? 'in-progress' : 
                    tech.status === 'in-progress' ? 'completed' : 'not-started'
                  )}
                  className="status-toggle"
                  title="Изменить статус"
                >
                  {getStatusIcon(tech.status)}
                </button>
                <Link 
                  to={`/technology/${tech.id}`} 
                  className="btn-link"
                  title="Редактировать"
                >
                  ✏️
                </Link>
                <button
                  onClick={() => handleDelete(tech.id, tech.title)}
                  className="btn-danger"
                  title="Удалить"
                >
                  🗑️
                </button>
              </div>
            </div>

            <p className="tech-description">{tech.description}</p>

            {tech.category && (
              <div className="tech-meta">
                <span className="category-badge">{tech.category}</span>
                {tech.difficulty && (
                  <span className={`difficulty-badge difficulty-${tech.difficulty}`}>
                    {tech.difficulty}
                  </span>
                )}
              </div>
            )}

            {tech.tags && tech.tags.length > 0 && (
              <div className="tech-tags">
                {tech.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>
            )}

            <div className="progress-section">
              <div className="progress-bar">
                <div 
                  className={`progress-fill ${getStatusColor(tech.status)}`}
                  style={{ width: getProgressWidth(tech.status) }}
                ></div>
              </div>
              <span className="progress-text">{getProgressWidth(tech.status)}</span>
            </div>

            <div className="card-footer">
              <span className={`status-badge ${getStatusColor(tech.status)}`}>
                {getStatusLabel(tech.status)}
              </span>
              <span className="create-date">
                Добавлено: {new Date(tech.createdAt).toLocaleDateString('ru-RU')}
              </span>
            </div>

            {tech.notes && (
              <div className="notes-preview">
                <strong>Заметки:</strong> 
                <p>{tech.notes.length > 100 ? tech.notes.substring(0, 100) + '...' : tech.notes}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredTechnologies.length === 0 && (
        <div className="empty-state">
          {technologies.length === 0 ? (
            <>
              <h3>Технологий пока нет</h3>
              <p>Добавьте первую технологию для отслеживания прогресса</p>
              <Link to="/add-technology" className="btn btn-primary">
                Добавить первую технологию
              </Link>
            </>
          ) : (
            <>
              <h3>Технологии не найдены</h3>
              <p>Попробуйте изменить поисковый запрос или фильтр</p>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setFilter('all');
                }}
                className="btn btn-secondary"
              >
                Сбросить фильтры
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default TechnologyList;