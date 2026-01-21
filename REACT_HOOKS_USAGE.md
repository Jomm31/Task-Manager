# React Hooks Usage in Task Manager

This document explains where and how React hooks (`useState`, `useEffect`, `useMemo`) are used throughout this project.

---

## 📌 Summary Table

| Hook | Files Used | Purpose |
|------|-----------|---------|
| `useState` | 8 files | Managing local component state |
| `useEffect` | 2 files | Side effects and lifecycle management |
| `useMemo` | 2 files | Performance optimization through memoization |

---

## 🔷 useState

`useState` is used for managing local component state. It returns a stateful value and a function to update it.

### Files Using useState:

### 1. `src/App.js`
```javascript
import React, { useState, useEffect } from 'react';

const [selectedProjectId, setSelectedProjectId] = useState(null);
const [sidebarOpen, setSidebarOpen] = useState(true);
const [showProjectModal, setShowProjectModal] = useState(false);
const [newProjectName, setNewProjectName] = useState('');
```
**Explanation:** Manages the main application state including which project is selected, sidebar visibility, modal visibility, and new project name input.

---

### 2. `src/components/board/KanbanBoard.js`
```javascript
import React, { useState, useRef, useMemo } from 'react';

const [selectedTask, setSelectedTask] = useState(null);
const [editingColumnId, setEditingColumnId] = useState(null);
const [editedColumnName, setEditedColumnName] = useState('');
const [addingColumn, setAddingColumn] = useState(false);
const [newColumnName, setNewColumnName] = useState('');
const [deleteModal, setDeleteModal] = useState({ 
  open: false, 
  column: null, 
  completed: 0, 
  incomplete: 0, 
  tasks: [],
  deleteOption: 'keep'
});
```
**Explanation:** Manages the Kanban board UI state including selected task for modal, column editing state, adding new columns, and delete confirmation modal state.

---

### 3. `src/components/board/TaskCard.js`
```javascript
import React, { useState } from 'react';

const [hovered, setHovered] = useState(false);
const [showDatePicker, setShowDatePicker] = useState(false);
const [calendarDate, setCalendarDate] = useState(new Date());
```
**Explanation:** Manages task card interactions - hover state for showing action buttons, date picker visibility, and the current calendar view date.

---

### 4. `src/components/board/Column.js`
```javascript
import React, { useState } from 'react';

const [isAddingTask, setIsAddingTask] = useState(false);
const [newTaskTitle, setNewTaskTitle] = useState('');
```
**Explanation:** Controls the "Add Task" input visibility and stores the new task title being typed.

---

### 5. `src/components/board/ColumnHeader.js`
```javascript
import React, { useState } from 'react';

const [menuOpen, setMenuOpen] = useState(false);
```
**Explanation:** Toggles the column options menu (rename, delete, add section).

---

### 6. `src/components/sidebar/ProjectItem.js`
```javascript
import React, { useState } from 'react';

const [hovered, setHovered] = useState(false);
const [editing, setEditing] = useState(false);
const [editName, setEditName] = useState(project.name);
const [showDeleteModal, setShowDeleteModal] = useState(false);
```
**Explanation:** Manages project item interactions - hover state for action buttons, inline editing mode, edited name value, and delete confirmation modal.

---

### 7. `src/components/common/SearchBar.js`
```javascript
import React, { useState, useEffect, useRef, useMemo } from 'react';

const [query, setQuery] = useState('');
const [isOpen, setIsOpen] = useState(false);
const [results, setResults] = useState({ projects: [], tasks: [] });
```
**Explanation:** Manages the search functionality - current search query, dropdown visibility, and filtered search results.

---

### 8. `src/components/calendar/CalendarView.js`
```javascript
import React, { useState } from 'react';

const [currentDate, setCurrentDate] = useState(new Date());
```
**Explanation:** Tracks the currently displayed month/year in the calendar view.

---

## 🔷 useEffect

`useEffect` handles side effects in functional components, such as data fetching, subscriptions, or manually changing the DOM.

### Files Using useEffect:

### 1. `src/App.js`
```javascript
import React, { useState, useEffect } from 'react';
```
**Explanation:** Used for application-level side effects like initializing data or responding to state changes.

---

### 2. `src/components/common/SearchBar.js`
```javascript
import React, { useState, useEffect, useRef, useMemo } from 'react';

// Effect 1: Search filtering when query changes
useEffect(() => {
  if (!query.trim()) {
    setResults({ projects: [], tasks: [] });
    return;
  }

  const lowerQuery = query.toLowerCase();
  
  const matchedProjects = projects.filter(p => 
    p.name.toLowerCase().includes(lowerQuery)
  ).slice(0, 5);
  
  const matchedTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(lowerQuery) ||
    (t.description && t.description.toLowerCase().includes(lowerQuery))
  ).slice(0, 10);
  
  setResults({ projects: matchedProjects, tasks: matchedTasks });
}, [query, projects, tasks]);
```
**Explanation:** Filters projects and tasks whenever the search query changes. Dependencies: `[query, projects, tasks]`.

---

```javascript
// Effect 2: Click outside to close dropdown
useEffect(() => {
  const handleClickOutside = (e) => {
    if (containerRef.current && !containerRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };
  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, []);
```
**Explanation:** Adds event listener to detect clicks outside the search dropdown and closes it. Returns a cleanup function to remove the listener.

---

```javascript
// Effect 3: Keyboard shortcuts
useEffect(() => {
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      inputRef.current?.focus();
      setIsOpen(true);
    }
    if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };
  document.addEventListener('keydown', handleKeyDown);
  return () => document.removeEventListener('keydown', handleKeyDown);
}, []);
```
**Explanation:** Implements keyboard shortcuts - `Ctrl+K` to focus search, `Escape` to close. Includes cleanup function.

---

## 🔷 useMemo

`useMemo` returns a memoized value, only recalculating when dependencies change. This optimizes performance by avoiding expensive calculations on every render.

### Files Using useMemo:

### 1. `src/components/board/KanbanBoard.js`
```javascript
import React, { useState, useRef, useMemo } from 'react';

// Memoize tasks grouped by column for performance optimization
const tasksByColumn = useMemo(() => {
  return columns.reduce((acc, column) => {
    acc[column.id] = allTasks.filter(task => task.columnId === column.id);
    return acc;
  }, {});
}, [columns, allTasks]);
```
**Explanation:** Groups all tasks by their column ID. This computation is memoized because:
- It runs on every render otherwise (filtering through all tasks for each column)
- Only recalculates when `columns` or `allTasks` actually change
- Improves performance especially with many tasks

---

### 2. `src/components/common/SearchBar.js`
```javascript
import React, { useState, useEffect, useRef, useMemo } from 'react';

// Memoize task count for display optimization
const totalSearchableItems = useMemo(() => {
  return projects.length + tasks.length;
}, [projects.length, tasks.length]);
```
**Explanation:** Calculates total searchable items count. Memoized to prevent recalculation on every render when only other props change.

---

## 🎯 When to Use Each Hook

| Hook | Use When |
|------|----------|
| `useState` | You need to track and update a value that affects rendering |
| `useEffect` | You need to perform side effects (API calls, subscriptions, DOM manipulation) |
| `useMemo` | You have expensive calculations that don't need to run on every render |

---

## 📁 File Location Quick Reference

| File | Hooks Used |
|------|------------|
| `src/App.js` | useState, useEffect |
| `src/components/board/KanbanBoard.js` | useState, useMemo |
| `src/components/board/TaskCard.js` | useState |
| `src/components/board/Column.js` | useState |
| `src/components/board/ColumnHeader.js` | useState |
| `src/components/sidebar/ProjectItem.js` | useState |
| `src/components/common/SearchBar.js` | useState, useEffect, useMemo |
| `src/components/calendar/CalendarView.js` | useState |
