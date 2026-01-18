import { configureStore } from '@reduxjs/toolkit';
import taskSlice from "../reducers/taskSlice"
import projectReducer from "../reducers/projectReducer";
import columnReducer from "../reducers/columnReducer";


// can use redux devtools by using configureStore, Install Redux DevTools Extension in Chrome/Firefox

const store = configureStore({
  reducer: {
    tasks: taskSlice,
    projects: projectReducer,
    columns: columnReducer
  }

})

export default store;