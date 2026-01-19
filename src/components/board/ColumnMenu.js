import React, { useState, useEffect, useRef } from 'react';

function ColumnMenu({ isOpen, onClose, onRename, onDelete, onAddSection, darkMode }) {
  const [addSectionHover, setAddSectionHover] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
        setAddSectionHover(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      ref={menuRef}
      className={`absolute right-0 z-10 mt-2 w-44 rounded shadow-lg ${darkMode ? 'bg-raisin text-lavender' : 'bg-white text-raisin'} border ${darkMode ? 'border-ceil/30' : 'border-lavender'}`}
      onClick={e => e.stopPropagation()}
    >
      <button
        className={`w-full text-left px-4 py-2 flex items-center gap-2 ${darkMode ? 'hover:bg-ceil/30' : 'hover:bg-lavender'}`}
        onClick={() => { onRename(); onClose(); }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 32 32" fill="currentColor">
          <path d="m20.234 3.673-14.49 14.49a5.121 5.121 0 0 0-1.209 1.925l-2.406 6.871a2.264 2.264 0 0 0 .54 2.369 2.266 2.266 0 0 0 2.371.541l6.872-2.405a5.144 5.144 0 0 0 1.924-1.209l14.49-14.491a5.728 5.728 0 0 0 0-8.092 5.73 5.73 0 0 0-8.092 0v.001ZM4.38 27.982a.27.27 0 0 1-.296-.067.269.269 0 0 1-.067-.294l2.124-6.065 4.304 4.304-6.065 2.123v-.001ZM26.912 5.088a3.726 3.726 0 0 1 0 5.263l-14.49 14.49c-.028.028-.064.047-.093.074l-5.244-5.244c.027-.029.046-.065.074-.093l14.49-14.49A3.71 3.71 0 0 1 24.281 4c.953 0 1.905.362 2.631 1.088Z"/>
        </svg>
        Rename column
      </button>
      
      <button
        className={`w-full text-left px-4 py-2 flex items-center gap-2 text-rose ${darkMode ? 'hover:bg-rose/20' : 'hover:bg-rose/10'}`}
        onClick={() => { onDelete(); onClose(); }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          <line x1="10" y1="11" x2="10" y2="17"></line>
          <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
        Delete column
      </button>
      
      <div className="border-t my-1 border-ceil/30"></div>
      
      <div className="relative">
        <button
          className={`w-full text-left px-4 py-2 flex items-center gap-2 ${darkMode ? 'hover:bg-ceil/30' : 'hover:bg-lavender'}`}
          onMouseEnter={() => setAddSectionHover(true)}
          onMouseLeave={() => setAddSectionHover(false)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add section
        </button>
        
        {/* Add section submenu */}
        {addSectionHover && (
          <div 
            className={`absolute left-full top-0 w-52 rounded shadow-lg ${darkMode ? 'bg-raisin text-lavender' : 'bg-white text-raisin'} border ${darkMode ? 'border-ceil/30' : 'border-lavender'}`}
            onMouseEnter={() => setAddSectionHover(true)}
            onMouseLeave={() => setAddSectionHover(false)}
          >
            <button
              className={`w-full text-left px-4 py-2 flex items-center gap-2 ${darkMode ? 'hover:bg-ceil/30' : 'hover:bg-lavender'}`}
              onClick={() => { onAddSection('left'); onClose(); }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Add section to left
            </button>
            <button
              className={`w-full text-left px-4 py-2 flex items-center gap-2 ${darkMode ? 'hover:bg-ceil/30' : 'hover:bg-lavender'}`}
              onClick={() => { onAddSection('right'); onClose(); }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
              Add section to right
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ColumnMenu;
