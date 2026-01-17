import { createStore, combineReducers } from "redux";
import taskReducer from "../reducers/taskReducer";
import projectReducer from "../reducers/projectReducer";
import columnReducer from "../reducers/columnReducer";

const rootReducer = combineReducers({
  tasks: taskReducer,
  projects: projectReducer,
  columns: columnReducer
});

const store = createStore(rootReducer);

export default store;