//redux toolkit (rtk)
import { createSlice } from '@reduxjs/toolkit';

const taskSlice = createSlice({
  name: 'tasks',
  initialState: [],
  reducers: {
    addTask: (state, action) => {
      state.push(action.payload);
    },

    updateTask: (state, action) => {
      const task = state.find(t => t.id === action.payload.id)
      if(task){
        Object.assign(task, action.payload);
      }
    },

    deleteTask: (state, action) => {
      return state.filter(task => task.id !== action.payload)
    }
      
  },
  extraReducers: (builder) => {
    builder.addCase('ADD_PROJECT_WITH_COLUMNS', (state, action) => {
      if (action.payload.task) {
        state.push(action.payload.task);
      }
    });
  }
});

export const { addTask, updateTask, deleteTask } = taskSlice.actions;
export default taskSlice.reducer;
