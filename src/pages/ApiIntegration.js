import { useState } from 'react';
import { Link } from 'react-router-dom';
import useTechnologiesApi from '../hooks/useTechnologiesApi';
import TechnologySearch from '../components/TechnologySearch';
import TechnologyResources from '../components/TechnologyResources';
import './ApiIntegration.css';

function ApiIntegration() {
  const {
    technologies,
    loading,
    error,
    searchTechnologies,
    addCustomTechnology
  } = useTechnologiesApi();

  const [selectedTech, setSelectedTech] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTech, setNewTech] = useState({
    name: '',
    description: '',
    category: 'frontend',
    difficulty: 'beginner'
  });

  const handleSearch = async (query) => {
    await searchTechnologies(query);
  };

  const handleAddTech = async (e) => {
    e.preventDefault();
    try {
      await addCustomTechnology(newTech);
      setNewTech({ name: '', description: '', category: 'frontend', difficulty: 'beginner' });
      setShowAddForm(false);
      alert('Технология успешно добавлена!');
    } catch (err) {
      alert('Ошибка при добавлении технологии');
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>🚀 Интеграция с API</h1>
        <p>Поиск технологий и загрузка дополнительных ресурсов</p>
      </div>

      <div className="api-demo">
        <div className="demo-section">
          <h2>🔍 Поиск технологий</h2>
          <TechnologySearch onSearch={handleSearch} loading={loading} />
          
          <div className="search-actions">
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="btn btn-primary"
            >
              {showAddForm ? '✕ Отмена' : '+ Добавить свою технологию'}
            </button>
            <Link to="/add-technology" className="btn btn-secondary">
              📝 Расширенное добавление
            </Link>
          </div>

          {showAddForm && (
            <form onSubmit={handleAddTech} className="quick-add-form">
              <h3>Быстрое добавление технологии</h3>
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Название технологии"
                  value={newTech.name}
                  onChange={(e) => setNewTech(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
                <select
                  value={newTech.category}
                  onChange={(e) => setNewTech(prev => ({ ...prev, category: e.target.value }))}
                >
                  <option value="frontend">Frontend</option>
                  <option value="backend">Backend</option>
                  <option value="database">Базы данных</option>
                  <option value="devops">DevOps</option>
                  <option value="mobile">Мобильная</option>
                  <option value="tools">Инструменты</option>
                </select>
              </div>
              <textarea
                placeholder="Описание технологии"
                value={newTech.description}
                onChange={(e) => setNewTech(prev => ({ ...prev, description: e.target.value }))}
                required
                rows="3"
              />
              <button type="submit" className="btn btn-success">
                Добавить технологию
              </button>
            </form>
          )}
        </div>

        {error && (
          <div className="error-banner">
            <p>{error}</p>
            <button onClick={() => searchTechnologies('')} className="btn btn-secondary">
              Попробовать снова
            </button>
          </div>
        )}

        <div className="technologies-section">
          <h2>Найдено технологий: {technologies.length}</h2>
          
          {loading && (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Загрузка данных...</p>
            </div>
          )}

          <div className="technologies-grid-api">
            {technologies.map(tech => (
              <div 
                key={tech.id} 
                className={`tech-card-api ${selectedTech?.id === tech.id ? 'selected' : ''}`}
                onClick={() => setSelectedTech(tech)}
              >
                <div className="tech-header">
                  <h3>{tech.name}</h3>
                  <span className={`difficulty difficulty-${tech.difficulty}`}>
                    {tech.difficulty}
                  </span>
                </div>
                <p className="tech-description">{tech.description}</p>
                <div className="tech-meta">
                  <span className="category">{tech.category}</span>
                  {tech.stars && (
                    <span className="github-stars">⭐ {tech.stars}</span>
                  )}
                  {tech.isCustom && (
                    <span className="custom-badge">Пользовательская</span>
                  )}
                </div>
                {tech.tags && (
                  <div className="tech-tags">
                    {tech.tags.map(tag => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {!loading && technologies.length === 0 && (
            <div className="empty-state">
              <p>Технологии не найдены. Попробуйте изменить поисковый запрос.</p>
            </div>
          )}
        </div>

        {selectedTech && (
          <div className="resources-section">
            <h2>Ресурсы для: {selectedTech.name}</h2>
            <TechnologyResources 
              technology={selectedTech}
              onResourcesLoad={(resources) => console.log('Ресурсы загружены:', resources)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ApiIntegration;