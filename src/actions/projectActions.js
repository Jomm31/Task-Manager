const ADD_PROJECT = 'ADD_PROJECT';
const UPDATE_PROJECT = 'UPDATE_PROJECT';
const DELETE_PROJECT = 'DELETE_PROJECT';
const ADD_PROJECT_WITH_COLUMNS = 'ADD_PROJECT_WITH_COLUMNS';
const REORDER_PROJECTS = 'REORDER_PROJECTS';

function addProject(projectData){
    return{
        type: ADD_PROJECT,
        payload: {
            id: Date.now(),
            ...projectData,
            order: Date.now(), // for sorting
            completed: false
        }
    }
}

function updateProject(id, updates){
    return {
        type: UPDATE_PROJECT,
        payload: {
        id,
        ...updates
        }
    }
}

function deleteProject(id){
    return {
        type: DELETE_PROJECT,
        payload: id
    }
}

function addProjectWithColumns(projectData){
    const projectId = Date.now();
    const backlogColumnId = projectId + 1;
    
    return{
        type: ADD_PROJECT_WITH_COLUMNS,
        payload: {
            project: {
                id: projectId,
                ...projectData,
                order: projectId, // for drag & drop sorting
                completed: false
            },
            columns: [
                {
                    id: backlogColumnId,
                    projectId: projectId,
                    name: 'Backlog',
                    order: 0
                },
                {
                    id: projectId + 2,
                    projectId: projectId,
                    name: 'To Do',
                    order: 1
                },
                {
                    id: projectId + 3,
                    projectId: projectId,
                    name: 'In Progress',
                    order: 2
                },
                {
                    id: projectId + 4,
                    projectId: projectId,
                    name: 'Done',
                    order: 3
                }
            ],
            task: {
                id: projectId + 5,
                projectId: projectId,
                columnId: backlogColumnId,
                title: 'Sample Task',
                description: 'This is your first task. Click to edit or delete it.',
                dueDate: null, // for deadline display
                order: 0, // for drag & drop sorting within column
                completed: false
            }
        }
    }
}

// Reorder projects (for drag & drop in sidebar)
function reorderProjects(projectIds){
    return {
        type: REORDER_PROJECTS,
        payload: projectIds // array of project IDs in new order
    }
}

export {addProject, updateProject, deleteProject, addProjectWithColumns, reorderProjects};