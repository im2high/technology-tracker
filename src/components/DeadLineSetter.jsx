import { useState } from 'react';
import './DeadLineSetter.css';

function DeadlineSetter({ technology, onDeadlineSet }) {
  const [deadline, setDeadline] = useState(technology.deadline || '');
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(!technology.deadline);

  const validateDeadline = (dateString) => {
    const errors = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const selectedDate = new Date(dateString);
    selectedDate.setHours(0, 0, 0, 0);

    if (!dateString) {
      errors.date = 'Дата обязательна для заполнения';
    } else if (selectedDate < today) {
      errors.date = 'Дата не может быть в прошлом';
    } else if (selectedDate > new Date(today.getFullYear() + 1, today.getMonth(), today.getDate())) {
      errors.date = 'Срок не может превышать 1 год';
    }

    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validationErrors = validateDeadline(deadline);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    onDeadlineSet(technology.id, deadline);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setDeadline(technology.deadline || '');
    setErrors({});
    setIsEditing(false);
  };

  const getDaysRemaining = () => {
    if (!technology.deadline) return null;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDate = new Date(technology.deadline);
    deadlineDate.setHours(0, 0, 0, 0);
    
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  const getDeadlineStatus = () => {
    const daysRemaining = getDaysRemaining();
    
    if (daysRemaining === null) return null;
    if (daysRemaining < 0) return 'overdue';
    if (daysRemaining === 0) return 'today';
    if (daysRemaining <= 7) return 'urgent';
    if (daysRemaining <= 30) return 'upcoming';
    return 'normal';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const daysRemaining = getDaysRemaining();
  const deadlineStatus = getDeadlineStatus();

  if (!isEditing && technology.deadline) {
    return (
      <div className="deadline-display">
        <div className={`deadline-status ${deadlineStatus}`}>
          <span className="deadline-label">Срок изучения:</span>
          <span className="deadline-date">{formatDate(technology.deadline)}</span>
          {daysRemaining !== null && (
            <span className="days-remaining">
              {deadlineStatus === 'overdue' && `⚠️ Просрочено на ${Math.abs(daysRemaining)} дн.`}
              {deadlineStatus === 'today' && '🎯 Сегодня!'}
              {deadlineStatus === 'urgent' && `🔥 Осталось ${daysRemaining} дн.`}
              {deadlineStatus === 'upcoming' && `⏳ Осталось ${daysRemaining} дн.`}
              {deadlineStatus === 'normal' && `✅ Осталось ${daysRemaining} дн.`}
            </span>
          )}
        </div>
        <button 
          onClick={() => setIsEditing(true)}
          className="btn-edit-deadline"
          title="Изменить срок"
        >
          ✏️
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="deadline-form">
      <div className="form-group">
        <label htmlFor={`deadline-${technology.id}`}>
          Установить срок изучения *
        </label>
        <input
          type="date"
          id={`deadline-${technology.id}`}
          value={deadline}
          onChange={(e) => {
            setDeadline(e.target.value);
            if (errors.date) {
              setErrors({});
            }
          }}
          min={new Date().toISOString().split('T')[0]}
          max={new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()).toISOString().split('T')[0]}
          className={errors.date ? 'error' : ''}
          aria-describedby={errors.date ? `deadline-error-${technology.id}` : undefined}
        />
        {errors.date && (
          <div id={`deadline-error-${technology.id}`} className="error-message">
            {errors.date}
          </div>
        )}
      </div>

      <div className="deadline-actions">
        <button type="submit" className="btn btn-primary btn-sm">
          ✅ Установить
        </button>
        {technology.deadline && (
          <button 
            type="button" 
            onClick={handleCancel}
            className="btn btn-secondary btn-sm"
          >
            Отмена
          </button>
        )}
        {technology.deadline && (
          <button 
            type="button" 
            onClick={() => {
              onDeadlineSet(technology.id, null);
              setDeadline('');
              setIsEditing(false);
            }}
            className="btn btn-danger btn-sm"
          >
            🗑️ Удалить срок
          </button>
        )}
      </div>

      {deadline && !errors.date && (
        <div className="deadline-preview">
          <strong>Предпросмотр:</strong> {formatDate(deadline)}
        </div>
      )}
    </form>
  );
}

export default DeadlineSetter;