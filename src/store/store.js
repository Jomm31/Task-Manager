import taskReducer from "../reducers/TaskReducer";
import { createStore } from "redux";

const store = createStore(taskReducer);

export default store;