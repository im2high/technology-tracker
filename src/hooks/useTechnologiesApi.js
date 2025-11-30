import { useState, useEffect, useCallback } from 'react';

const TECHNOLOGY_DATABASE = [
  {
    id: 1,
    name: 'React',
    description: 'Библиотека для создания пользовательских интерфейсов',
    category: 'frontend',
    difficulty: 'intermediate',
    website: 'https://reactjs.org',
    github: 'facebook/react',
    tags: ['ui', 'components', 'virtual-dom']
  },
  {
    id: 2,
    name: 'Vue.js',
    description: 'Прогрессивный фреймворк для создания пользовательских интерфейсов',
    category: 'frontend', 
    difficulty: 'beginner',
    website: 'https://vuejs.org',
    github: 'vuejs/vue',
    tags: ['framework', 'progressive', 'composition-api']
  },
  {
    id: 3,
    name: 'Node.js',
    description: 'Среда выполнения JavaScript вне браузера',
    category: 'backend',
    difficulty: 'intermediate',
    website: 'https://nodejs.org',
    github: 'nodejs/node',
    tags: ['runtime', 'server', 'javascript']
  },
  {
    id: 4,
    name: 'Express.js',
    description: 'Минималистичный веб-фреймворк для Node.js',
    category: 'backend',
    difficulty: 'beginner',
    website: 'https://expressjs.com',
    github: 'expressjs/express',
    tags: ['framework', 'web', 'middleware']
  },
  {
    id: 5,
    name: 'MongoDB',
    description: 'Документоориентированная система управления базами данных',
    category: 'database',
    difficulty: 'intermediate',
    website: 'https://mongodb.com',
    github: 'mongodb/mongo',
    tags: ['nosql', 'document', 'database']
  },
  {
    id: 6,
    name: 'PostgreSQL',
    description: 'Мощная объектно-реляционная система управления базами данных',
    category: 'database',
    difficulty: 'advanced',
    website: 'https://postgresql.org',
    github: 'postgres/postgres',
    tags: ['sql', 'relational', 'acid']
  },
  {
    id: 7,
    name: 'Docker',
    description: 'Платформа для разработки, доставки и запуска приложений в контейнерах',
    category: 'devops',
    difficulty: 'intermediate',
    website: 'https://docker.com',
    github: 'docker/docker-ce',
    tags: ['containers', 'virtualization', 'deployment']
  },
  {
    id: 8,
    name: 'TypeScript',
    description: 'Типизированное надмножество JavaScript',
    category: 'language',
    difficulty: 'intermediate',
    website: 'https://typescriptlang.org',
    github: 'microsoft/TypeScript',
    tags: ['types', 'compiler', 'javascript']
  }
];

function useTechnologiesApi() {
  const [technologies, setTechnologies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTechnologies = useCallback(async (searchQuery = '') => {
    try {
      setLoading(true);
      setError(null);
      
      await new Promise(resolve => setTimeout(resolve, 800));
      
      let filteredTechs = TECHNOLOGY_DATABASE;
      
      // Фильтрация по поисковому запросу
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredTechs = TECHNOLOGY_DATABASE.filter(tech =>
          tech.name.toLowerCase().includes(query) ||
          tech.description.toLowerCase().includes(query) ||
          tech.tags.some(tag => tag.toLowerCase().includes(query)) ||
          tech.category.toLowerCase().includes(query)
        );
      }
      
      const techsWithGitHubData = await Promise.all(
        filteredTechs.map(async (tech) => {
          try {
            if (tech.github) {
              const response = await fetch(`https://api.github.com/repos/${tech.github}`);
              if (response.ok) {
                const githubData = await response.json();
                return {
                  ...tech,
                  stars: githubData.stargazers_count,
                  forks: githubData.forks_count,
                  issues: githubData.open_issues_count,
                  lastUpdated: githubData.updated_at
                };
              }
            }
          } catch (err) {
            console.warn(`Не удалось загрузить данные GitHub для ${tech.name}:`, err);
          }
          return tech;
        })
      );
      
      setTechnologies(techsWithGitHubData);
      
    } catch (err) {
      setError('Не удалось загрузить технологии из API');
      console.error('Ошибка загрузки:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchTechnologies = useCallback(async (query) => {
    await fetchTechnologies(query);
  }, [fetchTechnologies]);

  const addCustomTechnology = useCallback(async (techData) => {
    try {
      setLoading(true);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newTech = {
        id: Date.now(),
        ...techData,
        isCustom: true,
        createdAt: new Date().toISOString()
      };
      
      setTechnologies(prev => [...prev, newTech]);
      return newTech;
      
    } catch (err) {
      throw new Error('Не удалось добавить технологию');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAdditionalResources = useCallback(async (techName) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const mockResources = {
        'React': [
          { title: 'Официальная документация', url: 'https://react.dev', type: 'docs' },
          { title: 'React Tutorial', url: 'https://react-tutorial.app', type: 'tutorial' },
          { title: 'Awesome React', url: 'https://github.com/enaqx/awesome-react', type: 'resources' }
        ],
        'Vue.js': [
          { title: 'Официальный гайд', url: 'https://vuejs.org/guide', type: 'docs' },
          { title: 'Vue Mastery', url: 'https://vuemastery.com', type: 'courses' }
        ],
        'Node.js': [
          { title: 'Node.js Docs', url: 'https://nodejs.org/docs', type: 'docs' },
          { title: 'Node.js Design Patterns', url: 'https://github.com/goldbergyoni/nodebestpractices', type: 'best-practices' }
        ]
      };
      
      return mockResources[techName] || [];
    } catch (err) {
      console.error('Ошибка загрузки ресурсов:', err);
      return [];
    }
  }, []);

  useEffect(() => {
    fetchTechnologies();
  }, [fetchTechnologies]);

  return {
    technologies,
    loading,
    error,
    fetchTechnologies,
    searchTechnologies,
    addCustomTechnology,
    fetchAdditionalResources
  };
}

export default useTechnologiesApi;