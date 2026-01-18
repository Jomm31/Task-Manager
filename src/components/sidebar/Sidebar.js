
function Sidebar({ projects, selectedProjectId, onSelectProject }) {
  return (
    <div className="w-64 bg-slate-800 text-white p-5 flex flex-col">
      <h2 className="text-xl font-bold mb-5">Projects</h2>
      
      <div className="flex-1 overflow-y-auto">
        {projects.map(project => (
          <div
            key={project.id}
            onClick={() => onSelectProject(project.id)}
            className={`p-3 mb-2 rounded-lg cursor-pointer transition-colors
              ${selectedProjectId === project.id 
                ? 'bg-blue-500' 
                : 'bg-slate-700 hover:bg-slate-600'}`}
          >
            {project.name}
          </div>
        ))}
      </div>
      
      <button className="w-full p-3 mt-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold transition-colors">
        + New Project
      </button>
    </div>
  );
}

export default Sidebar;