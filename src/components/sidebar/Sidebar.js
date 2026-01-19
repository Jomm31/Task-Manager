import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ProjectItem from './ProjectItem';

function Sidebar({ projects, selectedProjectId, onSelectProject, onShowProjectModal, onUpdateProject, onDeleteProject, onReorderProjects, darkMode }) {
  
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    if (result.destination.index === result.source.index) return;
    
    const reordered = Array.from(projects);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    
    // Send just the IDs in new order
    onReorderProjects(reordered.map(p => p.id));
  };

  return (
    <div className={`h-full w-64 ${darkMode ? 'bg-raisin' : 'bg-raisin'} text-lavender p-4 flex flex-col border-r border-ceil/30`}>
      <div className="flex items-center mb-3">
        <h2 className="text-lg font-bold flex-1">
          Projects <span className="text-xs text-silver">({projects.length})</span>
        </h2>
        <button
          className="text-raisin bg-ceil hover:bg-ceil/80 rounded-full w-7 h-7 flex items-center justify-center transition-colors"
          title="Add Project"
          onClick={onShowProjectModal}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      </div>
      <div className="border-b border-ceil/30 mb-3"></div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="projects">
          {(provided) => (
            <div 
              className="flex-1 overflow-y-auto"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {projects.length === 0 ? (
                <p className="text-sm text-silver">No projects yet</p>
              ) : (
                projects.map((project, index) => (
                  <Draggable key={project.id} draggableId={String(project.id)} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <ProjectItem
                          project={project}
                          isSelected={selectedProjectId === project.id}
                          onSelect={() => onSelectProject(project.id)}
                          onUpdate={(name) => onUpdateProject(project.id, name)}
                          onDelete={() => onDeleteProject(project.id)}
                          darkMode={darkMode}
                          isDragging={snapshot.isDragging}
                        />
                      </div>
                    )}
                  </Draggable>
                ))
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default Sidebar;