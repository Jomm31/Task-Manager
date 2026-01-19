import React, { useState } from 'react';
import ColumnMenu from './ColumnMenu';

function ColumnHeader({ 
  column, 
  taskCount, 
  isEditing, 
  editedName, 
  onEditChange, 
  onSave, 
  onStartEdit, 
  onCancelEdit,
  onDelete,
  onAddSection,
  darkMode,
  dragHandleProps 
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') onSave();
    if (e.key === 'Escape') onCancelEdit();
  };

  return (
    <div 
      className="flex items-center mb-3 cursor-grab active:cursor-grabbing group relative"
      {...dragHandleProps}
    >
      {isEditing ? (
        <input
          className={`font-bold ${darkMode ? 'text-lavender bg-raisin' : 'text-raisin bg-lavender'} rounded px-2 py-1 w-[200px] focus:outline-none focus:ring-2 focus:ring-ceil`}
          value={editedName}
          onChange={e => onEditChange(e.target.value)}
          onBlur={onSave}
          onKeyDown={handleKeyDown}
          autoFocus
          onClick={e => e.stopPropagation()}
          placeholder="New Section"
        />
      ) : (
        <h3
          className={`font-bold flex-1 cursor-pointer ${darkMode ? 'text-lavender' : 'text-raisin'}`}
          onDoubleClick={onStartEdit}
          title="Double click to rename, drag to reorder"
        >
          {column.name} <span className="text-xs font-normal text-silver">({taskCount})</span>
        </h3>
      )}
      
      {/* 3-dots menu button */}
      <div className="relative ml-2">
        <button
          className={`${menuOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity p-1 rounded-md ${darkMode ? 'hover:bg-ceil/30' : 'hover:bg-lavender'}`}
          onClick={e => {
            e.stopPropagation();
            setMenuOpen(!menuOpen);
          }}
          title="Column options"
        >
          <span style={{fontSize: '1.5em', lineHeight: 1}} className={darkMode ? 'text-lavender' : 'text-raisin'}>⋯</span>
        </button>
        
        <ColumnMenu
          isOpen={menuOpen}
          onClose={() => setMenuOpen(false)}
          onRename={onStartEdit}
          onDelete={onDelete}
          onAddSection={onAddSection}
          darkMode={darkMode}
        />
      </div>
    </div>
  );
}

export default ColumnHeader;
