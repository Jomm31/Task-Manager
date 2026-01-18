//redux toolkit (rtk) for reducer and action in one, and
//async thunk for adding tasks
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { taskAPI } from '../api/taskApi';

export const addTaskAsync = createAsyncThunk('tasks/addTask', async (taskData) => {
  return taskAPI.create(taskData);

});

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    items: [],
    loading: false,
    error: null
  },
  reducers: {
    addTask: (state, action) => {
      state.items.push(action.payload);
    },

    updateTask: (state, action) => {
      const task = state.items.find(t => t.id === action.payload.id)
      if(task){
        Object.assign(task, action.payload);
      }
    },

    deleteTask: (state, action) => {
      state.items = state.items.filter(task => task.id !== action.payload)
    }
      
  },
  extraReducers: (builder) => {
    builder.addCase('ADD_PROJECT_WITH_COLUMNS', (state, action) => {
      if (action.payload.task) {
        state.items.push(action.payload.task);
      }
    });

    builder.addCase(addTaskAsync.pending, (state, action) => {
      state.loading = true
      state.error = null
    });
    
    builder.addCase(addTaskAsync.fulfilled, (state, action) => {
      state.loading = false
      state.items.push(action.payload);
    
    });

    builder.addCase(addTaskAsync.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message;
      
    });
  }
});

export const { addTask, updateTask, deleteTask } = taskSlice.actions;
export default taskSlice.reducer;
