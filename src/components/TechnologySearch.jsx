import { useState, useEffect, useCallback } from 'react';
import './TechnologySearch.css';

function TechnologySearch({ onSearch, loading }) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (debouncedQuery !== '') {
      onSearch(debouncedQuery);
    }
  }, [debouncedQuery, onSearch]);

  const handleClear = useCallback(() => {
    setQuery('');
    setDebouncedQuery('');
    onSearch('');
  }, [onSearch]);

  return (
    <div className="technology-search">
      <div className="search-box">
        <input
          type="text"
          placeholder="🔍 Поиск технологий по названию, описанию или тегам..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
        {query && (
          <button 
            onClick={handleClear}
            className="search-clear"
            disabled={loading}
          >
            ✕
          </button>
        )}
        {loading && (
          <div className="search-spinner"></div>
        )}
      </div>
      
      {query && (
        <div className="search-info">
          Поиск: "{query}" {loading && '(загрузка...)'}
        </div>
      )}
    </div>
  );
}

export default TechnologySearch;