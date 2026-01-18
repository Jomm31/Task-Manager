import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // localStorage
import { combineReducers } from 'redux';
import taskSlice from "../reducers/taskSlice"
import projectReducer from "../reducers/projectReducer";
import columnReducer from "../reducers/columnReducer";

// Configure what to save to localStorage
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['tasks', 'projects', 'columns'] // Save these to localStorage
};

// Combine all reducers
const rootReducer = combineReducers({
  tasks: taskSlice,
  projects: projectReducer,
  columns: columnReducer
});

// Wrap reducer with persistence
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store with persisted reducer
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist actions
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
      }
    })
});

// Create persistor
export const persistor = persistStore(store);
export default store;