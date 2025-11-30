import logo from './logo.svg';
import './App.css';
import TechnologyCard from './components/TechnologyCard';
import ProgressHeader from './components/ProgressHeader';
import QuickActions from './components/QuickActions';
import TechnologyNotes from './components/TechnologyNotes';
import useTechnologies from './components/UseTechnologies';
import { useState } from 'react';

function App() {
  const {
    technologies,
    updateStatus,
    updateNotes,
    markAllAsCompleted,
    resetAllStatuses,
    getRandomNextTechnology,
    progress
  } = useTechnologies();

  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTechId, setSelectedTechId] = useState(null);

  const handleRandomNext = () => {
    const randomTech = getRandomNextTechnology();
    if (randomTech) {
      updateStatus(randomTech.id);
      alert(`Следующая технология: "${randomTech.title}"`);
    } else {
      alert('Все технологии уже начаты или завершены!');
    }
  };

  const filteredTechnologies = technologies.filter(tech => {
    const statusMatch = activeFilter === 'all' || tech.status === activeFilter;
    const searchMatch = searchQuery === '' || 
      tech.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.description.toLowerCase().includes(searchQuery.toLowerCase());
    return statusMatch && searchMatch;
  });

  const filterButtons = [
    { key: 'all', label: 'Все технологии' },
    { key: 'not-started', label: 'Не начатые' },
    { key: 'in-progress', label: 'В процессе' },
    { key: 'completed', label: 'Выполненные' }
  ];

  const selectedTech = technologies.find(tech => tech.id === selectedTechId);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Трекер изучения React</h1>
        <p>Отслеживайте прогресс изучения технологий React экосистемы</p>
        
        <div className="progress-section">
          <ProgressHeader technologies={technologies} />
          <div className="overall-progress">
            <span>Общий прогресс: {progress}%</span>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </header>
      
      <div className="technologies-container">
        <QuickActions 
          technologies={technologies}
          onMarkAllCompleted={markAllAsCompleted}
          onResetAll={resetAllStatuses}
          onRandomNext={handleRandomNext}
        />
        
        <div className="search-section">
          <h2>Поиск технологий</h2>
          <div className="search-box">
            <input
              type="text"
              placeholder="Поиск по названию или описанию..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button 
                className="search-clear"
                onClick={() => setSearchQuery('')}
              >
                ✕
              </button>
            )}
          </div>
          <div className="search-results-count">
            Найдено: <strong>{filteredTechnologies.length}</strong>
          </div>
        </div>
        
        <div className="filter-buttons">
          <h2>Фильтр по статусу:</h2>
          <div className="filter-buttons-container">
            {filterButtons.map(button => (
              <button
                key={button.key}
                className={`filter-button ${activeFilter === button.key ? 'filter-button--active' : ''}`}
                onClick={() => setActiveFilter(button.key)}
              >
                {button.label}
              </button>
            ))}
          </div>
        </div>

        {selectedTech && (
          <div className="notes-section-container">
            <h2>Заметки: {selectedTech.title}</h2>
            <TechnologyNotes 
              notes={selectedTech.notes}
              onNotesChange={updateNotes}
              techId={selectedTech.id}
            />
            <button 
              className="close-notes-button"
              onClick={() => setSelectedTechId(null)}
            >
              Закрыть
            </button>
          </div>
        )}

        <h2>Мой прогресс по технологиям ({filteredTechnologies.length})</h2>
        
        <div className="technologies-grid">
          {filteredTechnologies.map(tech => (
            <TechnologyCard
              key={tech.id}
              technology={tech}
              onStatusChange={updateStatus}
              onShowNotes={setSelectedTechId}
            />
          ))}
        </div>

        {filteredTechnologies.length === 0 && (
          <div className="no-results">
            <p>
              {searchQuery 
                ? `Не найдено по запросу "${searchQuery}"` 
                : 'Нет технологий с выбранным статусом'
              }
            </p>
            {searchQuery && (
              <button onClick={() => setSearchQuery('')}>
                Очистить поиск
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;