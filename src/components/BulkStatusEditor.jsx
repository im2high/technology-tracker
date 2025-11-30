import { useState } from 'react'; 
import './BulkStatusEditor.css';

function BulkStatusEditor({ technologies, onStatusUpdate }) {
  const [selectedTechIds, setSelectedTechIds] = useState([]);
  const [newStatus, setNewStatus] = useState('in-progress');
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTechnologies = technologies.filter(tech => {
    const statusMatch = filter === 'all' || tech.status === filter;
    const searchMatch = !searchQuery || 
      tech.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.description.toLowerCase().includes(searchQuery.toLowerCase());
    return statusMatch && searchMatch;
  });

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedTechIds(filteredTechnologies.map(tech => tech.id));
    } else {
      setSelectedTechIds([]);
    }
  };

  const handleTechSelect = (techId, isSelected) => {
    if (isSelected) {
      setSelectedTechIds(prev => [...prev, techId]);
    } else {
      setSelectedTechIds(prev => prev.filter(id => id !== techId));
    }
  };

  const applyBulkUpdate = () => {
    if (selectedTechIds.length === 0) {
      alert('Выберите хотя бы одну технологию');
      return;
    }

    if (window.confirm(`Изменить статус ${selectedTechIds.length} технологий на "${getStatusLabel(newStatus)}"?`)) {
      selectedTechIds.forEach(techId => {
        onStatusUpdate(techId, newStatus);
      });
      
      setSelectedTechIds([]);
      alert(`Статус обновлен для ${selectedTechIds.length} технологий`);
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      'not-started': 'Не начато',
      'in-progress': 'В процессе',
      'completed': 'Завершено'
    };
    return labels[status] || status;
  };

  const getStatusIcon = (status) => {
    const icons = {
      'not-started': '⭕',
      'in-progress': '🔄',
      'completed': '✅'
    };
    return icons[status] || '⭕';
  };

  const allSelected = filteredTechnologies.length > 0 && 
    selectedTechIds.length === filteredTechnologies.length;
  const someSelected = selectedTechIds.length > 0 && !allSelected;

  return (
    <div className="bulk-status-editor">
      <div className="bulk-header">
        <h3>📋 Массовое редактирование статусов</h3>
        <div className="selection-info">
          Выбрано: {selectedTechIds.length} из {filteredTechnologies.length}
        </div>
      </div>

      <div className="bulk-controls">
        <div className="control-group">
          <label>Фильтр по статусу:</label>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">Все статусы</option>
            <option value="not-started">Не начатые</option>
            <option value="in-progress">В процессе</option>
            <option value="completed">Завершенные</option>
          </select>
        </div>

        <div className="control-group">
          <label>Поиск:</label>
          <input
            type="text"
            placeholder="Поиск по названию..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="control-group">
          <label>Новый статус:</label>
          <select 
            value={newStatus} 
            onChange={(e) => setNewStatus(e.target.value)}
            className="status-select"
          >
            <option value="not-started">⭕ Не начато</option>
            <option value="in-progress">🔄 В процессе</option>
            <option value="completed">✅ Завершено</option>
          </select>
        </div>

        <button 
          onClick={applyBulkUpdate}
          disabled={selectedTechIds.length === 0}
          className="btn btn-primary apply-btn"
        >
          Применить к выбранным ({selectedTechIds.length})
        </button>
      </div>

      {filteredTechnologies.length === 0 ? (
        <div className="empty-state">
          <p>Технологии не найдены</p>
        </div>
      ) : (
        <div className="technologies-list">
          <div className="list-header">
            <label className="select-all-label">
              <input
                type="checkbox"
                checked={allSelected}
                ref={input => {
                  if (input) {
                    input.indeterminate = someSelected;
                  }
                }}
                onChange={handleSelectAll}
              />
              <span className="checkmark"></span>
              Выбрать все
            </label>
            <span className="header-title">Название</span>
            <span className="header-status">Текущий статус</span>
          </div>

          <div className="list-items">
            {filteredTechnologies.map(tech => (
              <div key={tech.id} className="tech-item">
                <label className="tech-select">
                  <input
                    type="checkbox"
                    checked={selectedTechIds.includes(tech.id)}
                    onChange={(e) => handleTechSelect(tech.id, e.target.checked)}
                  />
                  <span className="checkmark"></span>
                </label>
                
                <div className="tech-info">
                  <span className="tech-title">{tech.title}</span>
                  <span className="tech-description">{tech.description}</span>
                </div>
                
                <div className={`current-status status-${tech.status}`}>
                  {getStatusIcon(tech.status)} {getStatusLabel(tech.status)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedTechIds.length > 0 && (
        <div className="bulk-footer">
          <div className="selected-count">
            Выбрано технологий: <strong>{selectedTechIds.length}</strong>
          </div>
          <div className="preview-action">
            Будет установлен статус: <strong>{getStatusLabel(newStatus)}</strong>
          </div>
        </div>
      )}
    </div>
  );
}

export default BulkStatusEditor;