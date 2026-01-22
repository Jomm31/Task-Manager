import React, { useState, useEffect, useRef, useMemo } from 'react';

function SearchBar({ projects, tasks, onSelectProject, onSelectTask, darkMode }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState({ projects: [], tasks: [] });
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // Memoize task count for display optimization
  const totalSearchableItems = useMemo(() => {
    return projects.length + tasks.length;
  }, [projects.length, tasks.length]);

  // Get project name helper
  const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown Project';
  };

  // Search when query changes
  useEffect(() => {
    if (!query.trim()) {
      setResults({ projects: [], tasks: [] });
      return;
    }

    const lowerQuery = query.toLowerCase();
    
    // Search projects
    const matchedProjects = projects.filter(p => 
      p.name.toLowerCase().includes(lowerQuery)
    ).slice(0, 5);
    
    // Search tasks
    const matchedTasks = tasks.filter(t => 
      t.title.toLowerCase().includes(lowerQuery) ||
      (t.description && t.description.toLowerCase().includes(lowerQuery))
    ).slice(0, 10);
    
    setResults({ projects: matchedProjects, tasks: matchedTasks });
  }, [query, projects, tasks]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleProjectClick = (project) => {
    onSelectProject(project.id);
    setQuery('');
    setIsOpen(false);
  };

  const handleTaskClick = (task) => {
    onSelectTask(task);
    setQuery('');
    setIsOpen(false);
  };

  const hasResults = results.projects.length > 0 || results.tasks.length > 0;

  return (
    <div ref={containerRef} className="relative w-full max-w-xs sm:max-w-sm lg:max-w-md">
      {/* Search Input */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder={`Search ${totalSearchableItems} items... (Ctrl+K)`}
          className={`w-full px-3 sm:px-4 py-1.5 sm:py-2 pl-8 sm:pl-10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ceil transition-all ${
            darkMode 
              ? 'bg-raisin text-lavender placeholder-silver border-ceil/30' 
              : 'bg-mist text-raisin placeholder-dusk border-lavender'
          } border`}
        />
        <span className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-silver text-sm">
          🔍
        </span>
        {query && (
          <button
            onClick={() => { setQuery(''); setResults({ projects: [], tasks: [] }); }}
            className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-silver hover:text-lavender"
          >
            ✕
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && query.trim() && (
        <div className={`absolute top-full left-0 right-0 mt-2 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto ${
          darkMode ? 'bg-raisin border border-ceil/30' : 'bg-white border border-lavender'
        }`}>
          {!hasResults ? (
            <div className="p-4 text-center text-silver">
              No results found for "{query}"
            </div>
          ) : (
            <>
              {/* Projects Results */}
              {results.projects.length > 0 && (
                <div>
                  <div className={`px-4 py-2 text-xs font-semibold uppercase tracking-wide ${
                    darkMode ? 'bg-ceil/20 text-silver' : 'bg-lavender text-silver'
                  }`}>
                    Projects
                  </div>
                  {results.projects.map(project => (
                    <div
                      key={project.id}
                      onClick={() => handleProjectClick(project)}
                      className={`px-4 py-3 cursor-pointer flex items-center gap-3 transition-colors ${
                        darkMode ? 'hover:bg-ceil/20' : 'hover:bg-lavender/50'
                      }`}
                    >
                      <span className="text-lg">📁</span>
                      <div>
                        <div className={`font-medium ${darkMode ? 'text-lavender' : 'text-raisin'}`}>
                          {highlightMatch(project.name, query)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tasks Results */}
              {results.tasks.length > 0 && (
                <div>
                  <div className={`px-4 py-2 text-xs font-semibold uppercase tracking-wide ${
                    darkMode ? 'bg-ceil/20 text-silver' : 'bg-lavender text-silver'
                  }`}>
                    Tasks
                  </div>
                  {results.tasks.map(task => (
                    <div
                      key={task.id}
                      onClick={() => handleTaskClick(task)}
                      className={`px-4 py-3 cursor-pointer flex items-center gap-3 transition-colors ${
                        darkMode ? 'hover:bg-ceil/20' : 'hover:bg-lavender/50'
                      }`}
                    >
                      <span className="text-lg">📋</span>
                      <div className="flex-1 min-w-0">
                        <div className={`font-medium truncate ${darkMode ? 'text-lavender' : 'text-raisin'}`}>
                          {highlightMatch(task.title, query)}
                        </div>
                        <div className="text-sm truncate text-silver">
                          in {getProjectName(task.projectId)}
                          {task.dueDate && ` • Due: ${new Date(task.dueDate).toLocaleDateString()}`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// Helper to highlight matching text
function highlightMatch(text, query) {
  if (!query.trim()) return text;
  
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  
  return parts.map((part, i) => 
    regex.test(part) ? (
      <span key={i} className="bg-ceil text-raisin rounded px-0.5">{part}</span>
    ) : part
  );
}

export default SearchBar;
