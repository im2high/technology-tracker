import { useState, useEffect } from 'react';
import './TechnologyResources.css';

function TechnologyResources({ technology, onResourcesLoad }) {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadResources = async () => {
      if (!technology) return;
      
      try {
        setLoading(true);
        setError(null);
        
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const mockResources = [
          { 
            title: 'Официальная документация', 
            url: technology.website || `https://google.com/search?q=${technology.name} documentation`,
            type: 'docs',
            description: 'Официальная документация и руководства'
          },
          { 
            title: 'GitHub Repository', 
            url: technology.github ? `https://github.com/${technology.github}` : `https://github.com/search?q=${technology.name}`,
            type: 'code',
            description: 'Исходный код и issues'
          },
          { 
            title: 'Stack Overflow', 
            url: `https://stackoverflow.com/questions/tagged/${technology.name.toLowerCase()}`,
            type: 'community',
            description: 'Вопросы и ответы сообщества'
          },
          { 
            title: 'YouTube Tutorials', 
            url: `https://youtube.com/results?search_query=${technology.name}+tutorial`,
            type: 'video',
            description: 'Видео уроки и курсы'
          }
        ];
        
        setResources(mockResources);
        onResourcesLoad?.(mockResources);
        
      } catch (err) {
        setError('Не удалось загрузить ресурсы');
        console.error('Ошибка загрузки ресурсов:', err);
      } finally {
        setLoading(false);
      }
    };

    loadResources();
  }, [technology, onResourcesLoad]);

  if (!technology) return null;

  if (loading) {
    return (
      <div className="resources-loading">
        <div className="spinner-small"></div>
        <span>Загрузка ресурсов...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="resources-error">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="technology-resources">
      <h4>📚 Ресурсы для изучения</h4>
      <div className="resources-grid">
        {resources.map((resource, index) => (
          <a
            key={index}
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`resource-card resource-${resource.type}`}
          >
            <div className="resource-icon">
              {resource.type === 'docs' && '📖'}
              {resource.type === 'code' && '💻'}
              {resource.type === 'community' && '👥'}
              {resource.type === 'video' && '🎥'}
            </div>
            <div className="resource-content">
              <h5>{resource.title}</h5>
              <p>{resource.description}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

export default TechnologyResources;