import { useState } from 'react';
import './QuickActions.css';

function QuickActions({ 
  technologies, 
  onMarkAllCompleted, 
  onResetAll, 
  onRandomNext 
}) {
  const [showExportModal, setShowExportModal] = useState(false);

  const handleExport = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      totalTechnologies: technologies.length,
      completed: technologies.filter(tech => tech.status === 'completed').length,
      inProgress: technologies.filter(tech => tech.status === 'in-progress').length,
      notStarted: technologies.filter(tech => tech.status === 'not-started').length,
      technologies: technologies
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tech-tracker-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setShowExportModal(true);
  };

  return (
    <div className="quick-actions">
      <h3>Быстрые действия</h3>
      <div className="action-buttons">
        <button 
          onClick={onMarkAllCompleted} 
          className="btn btn-success"
        >
          ✅ Отметить все как выполненные
        </button>
        
        <button 
          onClick={onResetAll} 
          className="btn btn-warning"
        >
          🔄 Сбросить все статусы
        </button>
        
        <button 
          onClick={onRandomNext} 
          className="btn btn-primary"
        >
          🎲 Случайный выбор
        </button>
        
        <button 
          onClick={handleExport} 
          className="btn btn-info"
        >
          📤 Экспорт данных
        </button>
      </div>

      {showExportModal && (
        <div className="modal-overlay" onClick={() => setShowExportModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Экспорт данных</h3>
            <p>✅ Данные успешно экспортированы!</p>
            <p>Файл был скачан на ваше устройство.</p>
            <button 
              className="btn btn-primary"
              onClick={() => setShowExportModal(false)}
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuickActions;