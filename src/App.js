import logo from './logo.svg';
import './App.css';
import TechnologyCard from './components/TechnologyCard';
import ProgressHeader from './components/ProgressHeader';
import QuickActions from './components/QuickActions';
import TechnologyNotes from './components/TechnologyNotes';
import { useEffect, useState } from 'react';

function App() {
  const [technologies, setTechnologies] = useState([
    {
      id: 1,
      title: 'React Components',
      description: 'Изучение базовых компонентов и их жизненного цикла',
      status: 'not-started',
      notes: ''
    },
    {
      id: 2,
      title: 'JSX Syntax',
      description: 'Освоение синтаксиса JSX и работа с выражениями',
      status: 'not-started',
      notes: ''
    },
    {
      id: 3,
      title: 'State Management',
      description: 'Работа с состоянием компонентов и хуками',
      status: 'in-progress',
      notes: ''
    },
  ]);

  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTechId, setSelectedTechId] = useState(null); // Для отображения заметок

  useEffect(() => {
    localStorage.setItem('techTrackerData', JSON.stringify(technologies));
    console.log('Данные сохранены в LocalStorage');
  }, [technologies]);

  useEffect(() => {
    const saved = localStorage.getItem('techTrackerData');
    if (saved) {
      setTechnologies(JSON.parse(saved));
      console.log('Данные загружены из LocalStorage');
    }
  }, []);

  const updateTechnologyNotes = (techId, newNotes) => {
    setTechnologies(prevTech =>
      prevTech.map(tech =>
        tech.id === techId ? {...tech, notes: newNotes} : tech
      )
    );
  };

  const updateTechnologyStatus = (id) => {
    setTechnologies(prevTechnologies => 
      prevTechnologies.map(tech => {
        if (tech.id === id) {
          const statusFlow = ['not-started', 'in-progress', 'completed'];
          const currentIndex = statusFlow.indexOf(tech.status);
          const nextIndex = (currentIndex + 1) % statusFlow.length;
          return { ...tech, status: statusFlow[nextIndex] };
        }
        return tech;
      })
    );
  };

  const markAllAsCompleted = () => {
    setTechnologies(prevTechnologies => 
      prevTechnologies.map(tech => ({ ...tech, status: 'completed' }))
    );
  };

  const resetAllStatuses = () => {
    setTechnologies(prevTechnologies => 
      prevTechnologies.map(tech => ({ ...tech, status: 'not-started' }))
    );
  };

  const randomNextTechnology = () => {
    const notStartedTechs = technologies.filter(tech => tech.status === 'not-started');
    if (notStartedTechs.length === 0) {
      alert('Все технологии уже начаты или завершены!');
      return;
    }
    
    const randomTech = notStartedTechs[Math.floor(Math.random() * notStartedTechs.length)];
    updateTechnologyStatus(randomTech.id);
    alert(`Следующая технология для изучения: "${randomTech.title}"`);
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
        <p>
          Отслеживайте прогресс изучения технологий React экосистемы
        </p>
      </header>
      
      <div className="technologies-container">
        <ProgressHeader technologies={technologies} />
        
        <QuickActions 
          onMarkAllCompleted={markAllAsCompleted}
          onResetAll={resetAllStatuses}
          onRandomNext={randomNextTechnology}
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
                title="Очистить поиск"
              >
                ✕
              </button>
            )}
          </div>
          <div className="search-results-count">
            Найдено технологий: <strong>{filteredTechnologies.length}</strong>
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
            <h2>Заметки для: {selectedTech.title}</h2>
            <TechnologyNotes 
              notes={selectedTech.notes}
              onNotesChange={updateTechnologyNotes}
              techId={selectedTech.id}
            />
            <button 
              className="close-notes-button"
              onClick={() => setSelectedTechId(null)}
            >
              Закрыть заметки
            </button>
          </div>
        )}

        <h2>Мой прогресс по технологиям ({filteredTechnologies.length})</h2>
        
        <div className="technologies-grid">
          {filteredTechnologies.map(tech => (
            <div key={tech.id} className="technology-card-wrapper">
              <TechnologyCard
                id={tech.id}
                title={tech.title}
                description={tech.description}
                status={tech.status}
                onStatusChange={updateTechnologyStatus}
              />
              <button 
                className="show-notes-button"
                onClick={() => setSelectedTechId(tech.id)}
              >
                📝 Заметки
              </button>
            </div>
          ))}
        </div>

        {filteredTechnologies.length === 0 && (
          <div className="no-results">
            <p>
              {searchQuery 
                ? `Не найдено технологий по запросу "${searchQuery}"` 
                : 'Нет технологий с выбранным статусом'
              }
            </p>
            {searchQuery && (
              <button 
                className="clear-search-button"
                onClick={() => setSearchQuery('')}
              >
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