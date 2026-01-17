// Action Types
const ADD_TASK = 'ADD_TASK';
const UPDATE_TASK = 'UPDATE_TASK';
const DELETE_TASK = 'DELETE_TASK';

// Initial State
const initialState = [];

// Reducer Function
function taskReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_TASK:
      // Add new task to the array
      return [...state, action.payload];

    case UPDATE_TASK:
      // Update existing task by finding its ID
      return state.map(task =>
        task.id === action.payload.id
          ? { ...task, ...action.payload }
          : task
      );

    case DELETE_TASK:
      // Remove task by filtering out the one with matching ID
      return state.filter(task => task.id !== action.payload);

    default:
      // If action type doesn't match, return current state unchanged
      return state;
  }
}

export default taskReducer;

