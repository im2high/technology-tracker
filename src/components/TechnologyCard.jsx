import './TechnologyCard.css';

function TechnologyCard({ technology, onStatusChange, onShowNotes }) {
  const { id, title, description, status } = technology;

  const statusLabels = {
    'completed': 'Завершено',
    'in-progress': 'В процессе',
    'not-started': 'Не начато'
  };

  const progressWidths = {
    'completed': '100%',
    'in-progress': '50%', 
    'not-started': '0%'
  };

  const statusIcons = {
    'completed': '✅',
    'in-progress': '🔄', 
    'not-started': '⭕'
  };

  const handleClick = () => {
    onStatusChange(id);
  };

  const handleNotesClick = (e) => {
    e.stopPropagation();
    onShowNotes(id);
  };

  return (
    <div 
      className={`technology-card technology-card--${status}`}
      onClick={handleClick}
    >
      <div className={`status-indicator status-indicator--${status}`}>
        {statusLabels[status]}
      </div>
      
      <h3 className="technology-card__title">
        <span className="status-icon">
          {statusIcons[status]}
        </span>
        {title}
      </h3>
      
      <p className="technology-card__description">{description}</p>
      
      <div className="progress-indicator">
        <div className="progress-bar">
          <div 
            className={`progress-fill progress-fill--${status}`}
            style={{ width: progressWidths[status] }}
          ></div>
        </div>
        <span className="progress-text">
          {progressWidths[status]}
        </span>
      </div>
      
      <div className="technology-card__meta">
        <small>Прогресс изучения</small>
        <button 
          className="notes-button"
          onClick={handleNotesClick}
          title="Открыть заметки"
        >
          📝
        </button>
      </div>
    </div>
  );
}

export default TechnologyCard;