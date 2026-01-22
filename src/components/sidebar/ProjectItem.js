import React, { useState } from 'react';
import { createPortal } from 'react-dom';

function ProjectItem({ project, isSelected, onSelect, onUpdate, onDelete, darkMode, isDragging }) {
  const [hovered, setHovered] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(project.name);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleSave = () => {
    if (editName.trim() && editName !== project.name) {
      onUpdate(editName);
    }
    setEditing(false);
  };

  const handleCancel = () => {
    setEditName(project.name);
    setEditing(false);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    onDelete();
    setShowDeleteModal(false);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    setEditName(project.name);
    setEditing(true);
  };

  return (
    <>
      <div
        className={`p-3 mb-2 rounded-lg cursor-pointer flex items-center justify-between transition-all duration-150 ${
          isDragging
            ? 'bg-ceil text-raisin shadow-xl ring-2 ring-pastel scale-105 opacity-90'
            : isSelected 
              ? 'bg-ceil text-raisin' 
              : darkMode 
                ? 'bg-raisin/50 hover:bg-ceil/30 text-lavender'
                : 'bg-transparent hover:bg-ceil/20 text-raisin'
        }`}
        onClick={!editing ? onSelect : undefined}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {editing ? (
          <div className="flex-1 flex items-center gap-1">
            <input
              className={`w-[150px] px-2 py-1 rounded text-sm focus:outline-none focus:ring-2 focus:ring-ceil border ${
                darkMode ? 'bg-raisin text-lavender border-ceil/50' : 'bg-white text-raisin border-lavender'
              }`}
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') handleCancel(); }}
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="p-1 text-sage hover:text-sage-dark transition-colors flex-shrink-0"
              onClick={(e) => { e.stopPropagation(); handleSave(); }}
              title="Save"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </button>
            <button
              className="p-1 text-silver hover:text-lavender transition-colors flex-shrink-0"
              onClick={(e) => { e.stopPropagation(); handleCancel(); }}
              title="Cancel"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        ) : (
          <span className="truncate flex-1">{project.name}</span>
        )}
        {hovered && !editing && (
          <span className="flex gap-1 ml-2">
            <button
              title="Edit"
              className={`cursor-pointer p-1 rounded hover:bg-ceil/30 transition-colors ${
                isSelected ? 'text-raisin hover:text-white' : darkMode ? 'text-lavender hover:text-white' : 'text-silver hover:text-raisin'
              }`}
              onClick={handleEditClick}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 32 32" fill="currentColor">
                <path d="m20.234 3.673-14.49 14.49a5.121 5.121 0 0 0-1.209 1.925l-2.406 6.871a2.264 2.264 0 0 0 .54 2.369 2.266 2.266 0 0 0 2.371.541l6.872-2.405a5.144 5.144 0 0 0 1.924-1.209l14.49-14.491a5.728 5.728 0 0 0 0-8.092 5.73 5.73 0 0 0-8.092 0v.001ZM4.38 27.982a.27.27 0 0 1-.296-.067.269.269 0 0 1-.067-.294l2.124-6.065 4.304 4.304-6.065 2.123v-.001ZM26.912 5.088a3.726 3.726 0 0 1 0 5.263l-14.49 14.49c-.028.028-.064.047-.093.074l-5.244-5.244c.027-.029.046-.065.074-.093l14.49-14.49A3.71 3.71 0 0 1 24.281 4c.953 0 1.905.362 2.631 1.088Z"/>
              </svg>
            </button>
            <button
              title="Delete"
              className="cursor-pointer text-rose hover:text-rose-dark p-1 rounded hover:bg-rose/20 transition-colors"
              onClick={handleDeleteClick}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            </button>
          </span>
        )}
      </div>

      {/* Delete Confirmation Modal - rendered via portal to center on screen */}
      {showDeleteModal && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-midnight/80" onClick={() => setShowDeleteModal(false)}>
          <div 
            className="bg-dusk text-lavender rounded-lg shadow-xl p-6 w-full max-w-sm mx-4 border border-ceil/30"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold mb-2 text-mist">Delete Project</h2>
            <p className="mb-4 text-mauve">
              Are you sure you want to delete <span className="font-semibold break-all text-lavender">"{project.name}"</span>? This will also delete all tasks in this project.
            </p>
            <div className="flex gap-3">
              <button
                className="flex-1 bg-ceil/30 hover:bg-ceil/50 px-4 py-2 rounded font-medium transition-colors"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="flex-1 bg-rose hover:bg-rose-dark text-mist px-4 py-2 rounded font-medium transition-colors"
                onClick={handleConfirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

export default ProjectItem;
