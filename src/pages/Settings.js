import { useState } from 'react';
import './Settings.css';

function Settings() {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('appSettings');
    return saved ? JSON.parse(saved) : {
      theme: 'light',
      language: 'ru',
      notifications: true,
      autoSave: true,
      exportFormat: 'json'
    };
  });

  const saveSettings = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem('appSettings', JSON.stringify(newSettings));
  };

  const handleResetData = () => {
    if (window.confirm('Вы уверены, что хотите удалить все данные? Это действие нельзя отменить.')) {
      localStorage.removeItem('techTrackerData');
      localStorage.removeItem('appSettings');
      window.location.reload();
    }
  };

  const handleExportData = () => {
    const data = localStorage.getItem('techTrackerData');
    if (data) {
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `tech-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleImportData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          localStorage.setItem('techTrackerData', JSON.stringify(data));
          alert('Данные успешно импортированы!');
          window.location.reload();
        } catch (error) {
          alert('Ошибка при импорте данных. Проверьте формат файла.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>⚙️ Настройки</h1>
      </div>

      <div className="settings-grid">
        <div className="setting-section">
          <h3>Внешний вид</h3>
          
          <div className="setting-item">
            <label>Тема оформления</label>
            <select 
              value={settings.theme}
              onChange={(e) => saveSettings({ ...settings, theme: e.target.value })}
            >
              <option value="light">Светлая</option>
              <option value="dark">Темная</option>
              <option value="auto">Системная</option>
            </select>
          </div>

          <div className="setting-item">
            <label>Язык</label>
            <select 
              value={settings.language}
              onChange={(e) => saveSettings({ ...settings, language: e.target.value })}
            >
              <option value="ru">Русский</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>

        <div className="setting-section">
          <h3>Поведение</h3>
          
          <div className="setting-item checkbox">
            <label>
              <input
                type="checkbox"
                checked={settings.autoSave}
                onChange={(e) => saveSettings({ ...settings, autoSave: e.target.checked })}
              />
              Автосохранение
            </label>
            <span className="hint">Автоматически сохранять изменения</span>
          </div>

          <div className="setting-item checkbox">
            <label>
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => saveSettings({ ...settings, notifications: e.target.checked })}
              />
              Уведомления
            </label>
            <span className="hint">Показывать уведомления о прогрессе</span>
          </div>
        </div>

        <div className="setting-section">
          <h3>Управление данными</h3>
          
          <div className="setting-item">
            <label>Формат экспорта</label>
            <select 
              value={settings.exportFormat}
              onChange={(e) => saveSettings({ ...settings, exportFormat: e.target.value })}
            >
              <option value="json">JSON</option>
              <option value="csv">CSV</option>
            </select>
          </div>

          <div className="data-actions">
            <button onClick={handleExportData} className="btn btn-primary">
              📤 Экспорт данных
            </button>
            
            <label className="btn btn-secondary">
              📥 Импорт данных
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                style={{ display: 'none' }}
              />
            </label>
            
            <button onClick={handleResetData} className="btn btn-danger">
              🗑️ Очистить все данные
            </button>
          </div>
        </div>

        <div className="setting-section">
          <h3>Информация о приложении</h3>
          <div className="app-info">
            <p><strong>Версия:</strong> 1.0.0</p>
            <p><strong>Разработчик:</strong> Трекер технологий</p>
            <p><strong>Количество технологий:</strong> {JSON.parse(localStorage.getItem('techTrackerData') || '[]').length}</p>
            <p><strong>Последнее обновление:</strong> {new Date().toLocaleDateString('ru-RU')}</p>
          </div>
        </div>
      </div>

      <div className="settings-footer">
        <button 
          onClick={() => saveSettings({
            theme: 'light',
            language: 'ru',
            notifications: true,
            autoSave: true,
            exportFormat: 'json'
          })}
          className="btn btn-secondary"
        >
          Сбросить настройки
        </button>
      </div>
    </div>
  );
}

export default Settings;