const ADD_TASK = 'ADD_TASK';
const UPDATE_TASK = 'UPDATE_TASK';
const DELETE_TASK = 'DELETE_TASK';

function addTask(taskData){
    return{
        type: ADD_TASK,
        payload: {
            id: Date.now(),
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