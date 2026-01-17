const ADD_PROJECT = 'ADD_PROJECT';
const UPDATE_PROJECT = 'UPDATE_PROJECT';
const DELETE_PROJECT = 'DELETE_PROJECT';
const ADD_PROJECT_WITH_COLUMNS = 'ADD_PROJECT_WITH_COLUMNS';

function addProject(projectData){
    return{
        type: ADD_PROJECT,
        payload: {
            id: Date.now(),
            ...projectData,
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
                completed: false
            }
        }
    }
}


export {addProject, updateProject, deleteProject, addProjectWithColumns};