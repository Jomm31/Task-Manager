//redux toolkit (rtk) for reducer and action in one,
//async thunk for adding tasks and 
//Normalized State
import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import { taskAPI } from '../api/taskApi';

export const addTaskAsync = createAsyncThunk('tasks/addTask', async (taskData) => {
  return taskAPI.create(taskData);

});

const tasksAdapter = createEntityAdapter({
  selectId: (task) => task.id,
  sortComparer: (a, b) => a.id - b.id
});

const taskSlice = createSlice({
  name: 'tasks',
  initialState: tasksAdapter.getInitialState({
    loading: false,
    error: null
  }),
  reducers: {
    addTask: tasksAdapter.addOne,
    updateTask: tasksAdapter.updateOne,
    deleteTask: tasksAdapter.removeOne
  },
  extraReducers: (builder) => {
    builder.addCase('ADD_PROJECT_WITH_COLUMNS', (state, action) => {
      if (action.payload.task) {
        tasksAdapter.addOne(state, action.payload.task);
      }
    });

    builder.addCase(addTaskAsync.pending, (state, action) => {
      state.loading = true
      state.error = null
    });
    
    builder.addCase(addTaskAsync.fulfilled, (state, action) => {
      state.loading = false;
      tasksAdapter.addOne(state, action.payload);
    });

    builder.addCase(addTaskAsync.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message;
      
    });
  }
});

export const { addTask, updateTask, deleteTask } = taskSlice.actions;
export default taskSlice.reducer;

// Auto-generated selectors from entity adapter
export const {
  selectAll: selectAllTasks,
  selectById: selectTaskById,
  selectIds: selectTaskIds
} = tasksAdapter.getSelectors(state => state.tasks);
