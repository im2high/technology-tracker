import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Statistics.css';

function Statistics() {
  const [technologies, setTechnologies] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem('techTrackerData');
    if (saved) {
      const techData = JSON.parse(saved);
      setTechnologies(techData);
      calculateStats(techData);
    }
  }, []);

  const calculateStats = (techData) => {
    const total = techData.length;
    const completed = techData.filter(tech => tech.status === 'completed').length;
    const inProgress = techData.filter(tech => tech.status === 'in-progress').length;
    const notStarted = techData.filter(tech => tech.status === 'not-started').length;
    
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    const categories = {};
    techData.forEach(tech => {
      const category = tech.category || 'other';
      if (!categories[category]) {
        categories[category] = { total: 0, completed: 0, inProgress: 0, notStarted: 0 };
      }
      categories[category].total++;
      categories[category][tech.status]++;
    });

    setStats({
      total,
      completed,
      inProgress,
      notStarted,
      progress,
      categories
    });
  };

  const getProgressBar = (value, max, color = '#4CAF50') => (
    <div className="progress-bar">
      <div 
        className="progress-fill" 
        style={{ 
          width: `${max > 0 ? (value / max) * 100 : 0}%`,
          backgroundColor: color 
        }}
      ></div>
    </div>
  );

  if (technologies.length === 0) {
    return (
      <div className="page">
        <div className="page-header">
          <h1>Статистика</h1>
          <Link to="/add-technology" className="btn btn-primary">
            + Добавить технологию
          </Link>
        </div>
        <div className="empty-state">
          <p>Нет данных для отображения статистики.</p>
          <Link to="/add-technology" className="btn btn-primary">
            Добавить первую технологию
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>📊 Статистика изучения</h1>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Общий прогресс</h3>
          <div className="stat-number large">{stats.progress}%</div>
          {getProgressBar(stats.completed, stats.total)}
          <div className="stat-details">
            <span>{stats.completed} из {stats.total} завершено</span>
          </div>
        </div>

        <div className="stat-card">
          <h3>Распределение по статусам</h3>
          <div className="status-stats">
            <div className="status-item">
              <span className="status-dot completed"></span>
              <span>Завершено: {stats.completed}</span>
            </div>
            <div className="status-item">
              <span className="status-dot in-progress"></span>
              <span>В процессе: {stats.inProgress}</span>
            </div>
            <div className="status-item">
              <span className="status-dot not-started"></span>
              <span>Не начато: {stats.notStarted}</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <h3>Эффективность</h3>
          <div className="efficiency-stats">
            <div className="efficiency-item">
              <span>Начато:</span>
              <span>{stats.inProgress + stats.completed} / {stats.total}</span>
              {getProgressBar(stats.inProgress + stats.completed, stats.total, '#2196F3')}
            </div>
            <div className="efficiency-item">
              <span>Завершено:</span>
              <span>{stats.completed} / {stats.total}</span>
              {getProgressBar(stats.completed, stats.total, '#4CAF50')}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <h3>Рекомендации</h3>
          <div className="recommendations">
            {stats.notStarted > 0 && (
              <p>🎯 Начните изучение {stats.notStarted} технологий</p>
            )}
            {stats.inProgress > 0 && (
              <p>⚡ Завершите {stats.inProgress} технологий в процессе</p>
            )}
            {stats.completed === stats.total && (
              <p>🎉 Все технологии изучены! Отличная работа!</p>
            )}
            {stats.total === 0 && (
              <p>📚 Добавьте технологии для отслеживания прогресса</p>
            )}
          </div>
        </div>
      </div>

      {stats.categories && Object.keys(stats.categories).length > 0 && (
        <div className="categories-section">
          <h3>Прогресс по категориям</h3>
          <div className="categories-grid">
            {Object.entries(stats.categories).map(([category, data]) => (
              <div key={category} className="category-card">
                <h4>{category}</h4>
                <div className="category-progress">
                  {getProgressBar(data.completed, data.total, '#FF9800')}
                  <span>{Math.round((data.completed / data.total) * 100)}%</span>
                </div>
                <div className="category-details">
                  <span>{data.completed} из {data.total}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Statistics;