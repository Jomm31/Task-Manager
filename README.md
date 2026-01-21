# Task Manager

Live Demo: https://jomm31.github.io/Task-Manager/

A React-based task management application with Redux state management and Tailwind CSS styling.

## Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js** (v14 or higher recommended, currently tested with v22.20.0)
- **npm** (comes with Node.js)

## Installation

1. Clone the repository or navigate to the project directory:
```bash
cd Task-Manager
```

2. Install all dependencies:
```bash
npm install
```

## Running the Project

Start the development server:
```bash
npm start
```

The application will open in your browser at [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## Technology Stack

- **React** 16.14.0
- **Redux** 4.2.1
- **React-Redux** 7.2.9
- **Tailwind CSS** 3.3.0
- **React Scripts** 5.0.1

## Project Structure

```
Task-Manager/
├── public/           # Static files
├── src/
│   ├── actions/      # Redux actions
│   ├── components/   # React components
│   ├── layouts/      # Layout components
│   ├── pages/        # Page components
│   ├── reducers/     # Redux reducers
│   └── store/        # Redux store configuration
├── package.json
└── tailwind.config.js
```

## Features

- Project management
- Task organization
- Calendar view
- Redux state management
- Responsive design with Tailwind CSS
