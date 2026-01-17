const ADD_TASK = 'ADD_TASK';
const UPDATE_TASK = 'UPDATE_TASK';
const DELETE_TASK = 'DELETE_TASK';

function addTask(taskData, projectId, columnId){
    return{
        type: ADD_TASK,
        payload: {
            id: Date.now(),
            projectId,
            columnId,
            ...taskData,
            completed: false
        }
    }
}
function updateTask(id, updates){
    return{
        type: UPDATE_TASK,
        payload: {
            id,
            ...updates
        }
    }
}

function deleteTask(id){
    return{
        type: DELETE_TASK,
        payload: id
    }
}

export { addTask, updateTask, deleteTask };