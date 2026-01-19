# Task Manager - Project Explanation

## 🎯 Project Overview

A **Kanban-style task management application** built with React that allows users to organize projects, manage tasks across customizable columns, and track deadlines with a calendar view. Data persists in the browser's localStorage, eliminating the need for a backend server.

**Live Demo:** https://jomm31.github.io/Task-Manager

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 16** | UI library for building component-based interfaces |
| **Redux Toolkit** | Global state management for projects, columns, and tasks |
| **redux-persist** | Automatic data persistence to localStorage |
| **react-beautiful-dnd** | Drag-and-drop functionality for tasks and columns |
| **Tailwind CSS** | Utility-first CSS framework for rapid styling |
| **GitHub Pages** | Static site hosting for deployment |

---

## 🔴 Redux State Management (In-Depth)

This project demonstrates **production-level Redux patterns** with React 16. Here's a complete breakdown:

### Why Redux for This Project?

| Challenge | Redux Solution |
|-----------|----------------|
| Multiple components need same data | Single source of truth in store |
| Tasks appear in Board AND Calendar | Both read from same `tasks` state |
| Complex nested updates (project → columns → tasks) | Predictable unidirectional data flow |
| Data must persist across sessions | redux-persist middleware integration |
| Debugging state changes | Redux DevTools time-travel debugging |

### Store Configuration

```javascript
// store/store.js
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';

// Combine all domain reducers
const rootReducer = combineReducers({
  tasks: taskSlice,
  projects: projectReducer,
  columns: columnReducer
});

// Persistence configuration
const persistConfig = {
  key: 'root',
  storage,                              // localStorage
  whitelist: ['tasks', 'projects', 'columns']  // What to persist
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
      }
    })
});

export const persistor = persistStore(store);
export default store;
```

### State Shape

```javascript
// The entire app state structure:
{
  tasks: [
    {
      id: 1705123456789,
      projectId: 1705000000000,
      columnId: 1705000000001,
      title: "Implement login",
      description: "Add OAuth support",
      dueDate: "2026-01-25",
      order: 0,
      completed: false
    },
    // ... more tasks
  ],
  
  projects: [
    {
      id: 1705000000000,
      name: "My Project",
      order: 0
    },
    // ... more projects
  ],
  
  columns: [
    {
      id: 1705000000001,
      projectId: 1705000000000,
      name: "To Do",
      order: 0
    },
    // ... more columns
  ]
}
```

### Reducer Patterns

#### 1. Redux Toolkit Slice (Modern Pattern)
```javascript
// reducers/taskSlice.js
import { createSlice } from '@reduxjs/toolkit';

const taskSlice = createSlice({
  name: 'tasks',
  initialState: [],
  reducers: {
    // Immer allows "mutating" syntax that produces immutable updates
    addTask: (state, action) => {
      state.push(action.payload);
    },
    
    updateTask: (state, action) => {
      const { id, changes } = action.payload;
      const task = state.find(t => t.id === id);
      if (task) {
        Object.assign(task, changes);  // Immer handles immutability
      }
    },
    
    deleteTask: (state, action) => {
      return state.filter(t => t.id !== action.payload);
    }
  }
});

// Auto-generated action creators
export const { addTask, updateTask, deleteTask } = taskSlice.actions;
export default taskSlice.reducer;
```

#### 2. Traditional Reducer Pattern
```javascript
// reducers/projectReducer.js
const initialState = [];

export default function projectReducer(state = initialState, action) {
  switch (action.type) {
    case 'ADD_PROJECT':
      return [...state, action.payload];  // Immutable spread
      
    case 'UPDATE_PROJECT':
      return state.map(project =>
        project.id === action.payload.id
          ? { ...project, ...action.payload.changes }  // Immutable update
          : project
      );
      
    case 'DELETE_PROJECT':
      return state.filter(p => p.id !== action.payload);
      
    case 'REORDER_PROJECTS':
      return action.payload.map((id, index) => ({
        ...state.find(p => p.id === id),
        order: index
      }));
      
    default:
      return state;
  }
}
```

### Action Creators with Thunks

```javascript
// actions/projectActions.js
// Thunk for complex async-like operations
export const addProjectWithColumns = (project) => (dispatch) => {
  const projectId = Date.now();
  
  // Dispatch multiple related actions
  dispatch({
    type: 'ADD_PROJECT',
    payload: { id: projectId, name: project.name, order: 0 }
  });
  
  // Create default columns for new project
  const defaultColumns = ['To Do', 'In Progress', 'Done'];
  defaultColumns.forEach((name, index) => {
    dispatch({
      type: 'ADD_COLUMN',
      payload: {
        id: Date.now() + index + 1,
        projectId,
        name,
        order: index
      }
    });
  });
};
```

### Selectors with Memoization (Reselect)

```javascript
// selectors/taskSelectors.js
import { createSelector } from 'reselect';

// Base selector
export const selectAllTasks = state => state.tasks;

// Memoized selector - only recomputes when tasks or columnId changes
export const selectTasksByColumn = createSelector(
  [selectAllTasks, (state, columnId) => columnId],
  (tasks, columnId) => tasks
    .filter(t => t.columnId === columnId)
    .sort((a, b) => a.order - b.order)
);

// Selector for calendar view - tasks with due dates
export const selectTasksWithDueDates = createSelector(
  [selectAllTasks],
  (tasks) => tasks.filter(task => task.dueDate)
);

// Why memoization matters:
// Without: Every render filters ALL tasks (O(n) every time)
// With: Returns cached result if inputs unchanged (O(1))
```

### Connecting React Components

#### Using Hooks (Functional Components)
```javascript
// components/board/KanbanBoard.js
import { useSelector, useDispatch } from 'react-redux';
import { selectColumnsByProject } from '../../selectors/columnSelectors';
import { updateTask } from '../../reducers/taskSlice';

function KanbanBoard({ projectId }) {
  const dispatch = useDispatch();
  
  // Read from store with selector
  const columns = useSelector(state => selectColumnsByProject(state, projectId));
  const allTasks = useSelector(selectAllTasks);
  
  // Dispatch actions
  const handleUpdateTask = (taskId, changes) => {
    dispatch(updateTask({ id: taskId, changes }));
  };
  
  return (/* JSX */);
}
```

#### Provider Setup
```javascript
// index.js
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './store/store';

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);
```

### Redux Data Flow in This App

```
┌─────────────────────────────────────────────────────────────────┐
│                         REDUX STORE                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   projects  │  │   columns   │  │    tasks    │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│         │               │                │                       │
│         └───────────────┼────────────────┘                       │
│                         │                                        │
│              redux-persist (localStorage)                        │
└─────────────────────────────────────────────────────────────────┘
                          │
            ┌─────────────┼─────────────┐
            │             │             │
            ▼             ▼             ▼
      ┌──────────┐  ┌──────────┐  ┌──────────┐
      │ Sidebar  │  │  Board   │  │ Calendar │
      │          │  │          │  │          │
      │ projects │  │ columns  │  │  tasks   │
      │          │  │ + tasks  │  │ by date  │
      └──────────┘  └──────────┘  └──────────┘
            │             │             │
            └─────────────┼─────────────┘
                          │
                    User Actions
                          │
                          ▼
                   dispatch(action)
                          │
                          ▼
                    Reducer updates
                          │
                          ▼
                   Store notifies
                          │
                          ▼
                 Components re-render
```

### Real Example: Drag-and-Drop Task Update

```javascript
// When user drags task from "To Do" to "Done":

// 1. Event fires from react-beautiful-dnd
const handleDragEnd = (result) => {
  const { destination, source, draggableId } = result;
  
  // 2. Parse the result
  const taskId = parseInt(draggableId);
  const newColumnId = parseInt(destination.droppableId);
  
  // 3. Dispatch Redux action
  dispatch(updateTask({
    id: taskId,
    changes: {
      columnId: newColumnId,      // Move to new column
      order: destination.index    // New position
    }
  }));
  
  // 4. Redux processes:
  //    - taskSlice reducer finds task, updates columnId & order
  //    - Store state updates immutably
  //    - redux-persist saves to localStorage
  //    - All subscribed components re-render with new data
  //    - User sees task in new column instantly
};
```

### Benefits Demonstrated

| Redux Concept | How It's Used |
|---------------|---------------|
| **Single Source of Truth** | All data in one store, accessed everywhere |
| **Immutable Updates** | Reducers never mutate, always return new state |
| **Unidirectional Flow** | Actions → Reducers → Store → Components |
| **Middleware** | redux-persist for automatic localStorage sync |
| **Selectors** | Memoized queries prevent unnecessary renders |
| **DevTools** | Time-travel debugging during development |
| **Thunks** | Complex multi-action operations (add project + columns) |

---

## 🏗️ Architecture

### State Management (Redux)

```
store/
├── store.js          → Configures Redux store with persistence
reducers/
├── projectReducer.js → Handles project CRUD operations
├── columnReducer.js  → Manages columns (sections) per project
├── taskSlice.js      → Task management with Redux Toolkit
selectors/
├── projectSelectors.js → Memoized project queries
├── columnSelectors.js  → Memoized column queries
├── taskSelectors.js    → Memoized task queries
```

**Why Redux?**
- Centralized state makes data flow predictable
- Multiple components need access to the same data (tasks appear in board AND calendar)
- Redux DevTools enable easy debugging
- redux-persist seamlessly saves state to localStorage

### Component Architecture

```
components/
├── board/
│   ├── KanbanBoard.js      → Main board orchestrator (~230 lines)
│   ├── Column.js           → Individual column wrapper
│   ├── ColumnHeader.js     → Column title and menu trigger
│   ├── ColumnMenu.js       → Dropdown with rename/delete/add options
│   ├── TaskList.js         → Droppable container for tasks
│   ├── TaskCard.js         → Individual task with due date picker
│   ├── TaskModal.js        → Edit task details
│   ├── AddTaskInput.js     → Inline task creation
│   ├── AddColumnForm.js    → New column creation
│   ├── DeleteColumnModal.js→ Confirmation dialog
│   └── hooks/
│       └── useBoardDragDrop.js → Custom hook for drag logic
├── sidebar/
│   ├── Sidebar.js          → Project list with drag reordering
│   ├── ProjectItem.js      → Individual project with edit/delete
│   └── ProjectModal.js     → Add new project
├── calendar/
│   └── CalendarView.js     → Monthly calendar showing tasks by due date
└── common/
    └── SearchBar.js        → Global search across all projects/tasks
```

**Why this structure?**
- **Separation of Concerns:** Each component has a single responsibility
- **Reusability:** Components like `DeleteColumnModal` can be reused
- **Testability:** Small components are easier to unit test
- **Maintainability:** Changes are localized to specific files

---

## ✨ Key Features

### 1. **Drag and Drop**
- Reorder tasks within columns
- Move tasks between columns
- Reorder columns themselves
- Reorder projects in sidebar

**Implementation:** Uses `react-beautiful-dnd` with separate `Droppable` contexts for columns and tasks. The `useBoardDragDrop` custom hook encapsulates the complex reordering logic.

### 2. **Data Persistence**
- All data saved to browser's localStorage
- Survives page refresh and browser close
- No backend required

**Implementation:** `redux-persist` wraps the Redux store, automatically serializing state to localStorage and rehydrating on app load.

### 3. **Responsive Design**
- Mobile-first approach
- Sidebar collapses on mobile
- Touch-friendly interactions
- Synchronized horizontal scrollbar on desktop

### 4. **Dark/Light Mode**
- User preference saved to localStorage
- Custom color palette with semantic colors
- Consistent theming across all components

### 5. **Custom Calendar Picker**
- Month view calendar for selecting due dates
- Visual indicators for today and selected date
- No external date picker library needed

### 6. **Global Search**
- Search across all projects and tasks
- Keyboard navigation support
- Click result to navigate to that project/task

---

## 🔄 Data Flow Example

**When a user drags a task to a new column:**

```
1. User drops task → react-beautiful-dnd fires onDragEnd
2. useBoardDragDrop hook processes the result
3. Dispatch updateTask action with new columnId
4. taskSlice reducer updates the state immutably
5. redux-persist saves new state to localStorage
6. React re-renders affected components
7. User sees task in new column
```

---

## 📁 Key Code Patterns

### Custom Hook for Drag-Drop Logic
```javascript
// hooks/useBoardDragDrop.js
export function useBoardDragDrop(columns, allTasks, projectId) {
  const dispatch = useDispatch();

  const handleDragEnd = (result) => {
    // Complex reordering logic extracted from component
    // Makes KanbanBoard.js cleaner and logic reusable
  };

  return { handleDragEnd };
}
```

### Memoized Selectors with Reselect
```javascript
// selectors/taskSelectors.js
export const selectTasksByColumn = createSelector(
  [selectAllTasks, (state, columnId) => columnId],
  (tasks, columnId) => tasks.filter(t => t.columnId === columnId)
);
// Prevents unnecessary re-renders by caching results
```

### Redux Toolkit Slice Pattern
```javascript
// reducers/taskSlice.js
const taskSlice = createSlice({
  name: 'tasks',
  initialState: [],
  reducers: {
    addTask: (state, action) => { state.push(action.payload); },
    updateTask: (state, action) => {
      const { id, changes } = action.payload;
      const task = state.find(t => t.id === id);
      if (task) Object.assign(task, changes);
    },
    deleteTask: (state, action) => state.filter(t => t.id !== action.payload)
  }
});
```

---

## 🎨 Custom Color System

Extended Tailwind with a cohesive color palette:

| Color | RGB | Usage |
|-------|-----|-------|
| `raisin` | (40, 38, 45) | Dark backgrounds |
| `dusk` | (55, 52, 65) | Elevated surfaces (cards, modals) |
| `ceil` | (153, 151, 191) | Primary accent |
| `lavender` | (208, 203, 227) | Text color |
| `sage` | (134, 179, 152) | Success actions |
| `rose` | (198, 134, 147) | Danger/delete actions |

---

## 🚀 Deployment

- **Hosting:** GitHub Pages (free static hosting)
- **Build:** `npm run build` creates optimized production bundle
- **Deploy:** `npm run deploy` pushes to `gh-pages` branch
- **CI/CD:** Manual deployment via npm script

---

## 📊 Project Statistics

| Metric | Value |
|--------|-------|
| Total Components | 15+ |
| Lines of Code | ~2,500 |
| Bundle Size (gzip) | ~96 KB JS, ~5 KB CSS |
| External Dependencies | 8 |
| Build Time | ~15 seconds |

---

## 🧠 Technical Decisions & Trade-offs

### Why localStorage instead of a database?
- **Pros:** No backend costs, instant load, works offline, simpler architecture
- **Cons:** Data tied to one browser, limited to ~5MB, no cross-device sync
- **Reasoning:** For a portfolio project demonstrating frontend skills, localStorage is sufficient

### Why Redux over Context API?
- **Pros:** DevTools, middleware support, predictable updates, persistence library
- **Cons:** More boilerplate than Context
- **Reasoning:** The app has complex state interactions (tasks, columns, projects) that benefit from Redux's structure

### Why Tailwind over CSS Modules?
- **Pros:** Rapid prototyping, consistent design tokens, smaller bundle
- **Cons:** Long class names, learning curve
- **Reasoning:** Faster development and easy theming with custom colors

---

## 🔮 Potential Improvements

1. **Backend Integration** - Add Express/Node.js API with MongoDB for multi-device sync
2. **User Authentication** - Firebase Auth or Auth0 for user accounts
3. **Real-time Collaboration** - WebSockets for team features
4. **PWA Support** - Service workers for offline-first experience
5. **Testing** - Jest + React Testing Library for unit/integration tests
6. **Accessibility** - ARIA labels, keyboard navigation improvements

---

## 💡 Used

- ✅ React component composition and hooks
- ✅ Global state management with Redux Toolkit
- ✅ Custom hooks for logic extraction
- ✅ Drag-and-drop implementation
- ✅ Responsive design with Tailwind CSS
- ✅ Data persistence strategies
- ✅ Code organization and refactoring
- ✅ Git version control and deployment
