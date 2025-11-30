import { useState, useEffect, useCallback } from 'react';

const initialTechnologies = [
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
  }
];

function useTechnologies() {
  const [technologies, setTechnologies] = useState(() => {
    const saved = localStorage.getItem('techTrackerData');
    return saved ? JSON.parse(saved) : initialTechnologies;
  });

  useEffect(() => {
    localStorage.setItem('techTrackerData', JSON.stringify(technologies));
  }, [technologies]);

  const updateStatus = useCallback((id) => {
    setTechnologies(prev => 
      prev.map(tech => {
        if (tech.id === id) {
          const statusFlow = ['not-started', 'in-progress', 'completed'];
          const currentIndex = statusFlow.indexOf(tech.status);
          const nextIndex = (currentIndex + 1) % statusFlow.length;
          return { ...tech, status: statusFlow[nextIndex] };
        }
        return tech;
      })
    );
  }, []);

  const updateNotes = useCallback((id, notes) => {
    setTechnologies(prev =>
      prev.map(tech =>
        tech.id === id ? { ...tech, notes } : tech
      )
    );
  }, []);

  const markAllAsCompleted = useCallback(() => {
    setTechnologies(prev => 
      prev.map(tech => ({ ...tech, status: 'completed' }))
    );
  }, []);

  const resetAllStatuses = useCallback(() => {
    setTechnologies(prev => 
      prev.map(tech => ({ ...tech, status: 'not-started' }))
    );
  }, []);

  const getRandomNextTechnology = useCallback(() => {
    const notStarted = technologies.filter(tech => tech.status === 'not-started');
    return notStarted.length > 0 ? notStarted[Math.floor(Math.random() * notStarted.length)] : null;
  }, [technologies]);

  const calculateProgress = useCallback(() => {
    if (technologies.length === 0) return 0;
    const completed = technologies.filter(tech => tech.status === 'completed').length;
    return Math.round((completed / technologies.length) * 100);
  }, [technologies]);

  return {
    technologies,
    updateStatus,
    updateNotes,
    markAllAsCompleted,
    resetAllStatuses,
    getRandomNextTechnology,
    progress: calculateProgress()
  };
}

export default useTechnologies;