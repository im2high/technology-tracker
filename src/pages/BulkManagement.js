import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BulkStatusEditor from '../components/BulkStatusEditor';
import './BulkManagement.css';

function BulkManagement() {
  const [technologies, setTechnologies] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('techTrackerData');
    if (saved) {
      setTechnologies(JSON.parse(saved));
    }
  }, []);

  const updateTechnologyStatus = (techId, newStatus) => {
    const updated = technologies.map(tech =>
      tech.id === techId ? { ...tech, status: newStatus } : tech
    );
    setTechnologies(updated);
    localStorage.setItem('techTrackerData', JSON.stringify(updated));
  };

  return (
    <div className="page">
      <div className="page-header">
        <Link to="/technologies" className="back-link">
          ← Назад к списку
        </Link>
        <h1>⚡ Массовое управление</h1>
      </div>

      <div className="bulk-management">
        {technologies.length === 0 ? (
          <div className="empty-state">
            <h2>Нет технологий для управления</h2>
            <p>Добавьте технологии, чтобы использовать массовое редактирование</p>
            <Link to="/add-technology" className="btn btn-primary">
              Добавить технологии
            </Link>
          </div>
        ) : (
          <BulkStatusEditor 
            technologies={technologies}
            onStatusUpdate={updateTechnologyStatus}
          />
        )}
      </div>
    </div>
  );
}

export default BulkManagement;