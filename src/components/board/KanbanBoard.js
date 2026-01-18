import { useSelector } from 'react-redux';
import { selectColumnsByProject } from '../../selectors/columnSelectors'

function KanbanBoard({ projectId }){
    // Get columns for this project from Redux
    const columns = useSelector(state => selectColumnsByProject(state, projectId));

    return (
        <div className= "flex gap-4 h-full">
            {columns.map(column => (
                <div
                    key={column.id}
                    className="w-72 bg-gray-200 rounded-lg p-4 flex flex-col"
                >
                
                    {/*Column Header */}
                    <h3 className="font-bold text-gray-700 mb-3">{column.name}</h3>

                    {/* Task will go here*/}
                    <div className= "flex-1 overflow-y-auto">
                        <p className = "text-gray-400 text-sm">Task go here...</p>
                    </div>

                    {/* Add task button */}
                    <button className= "mt-2 p-2 text-gray-500 hover:bg-gray-300 rounded text-left">
                        + Add Task
                    </button>
                </div>
            ))}
        </div>
    );
}

export default KanbanBoard;