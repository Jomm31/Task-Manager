import React, { useState } from 'react';

function CalendarView({ tasks, projects, onTaskClick, darkMode }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  // Get first day of month and number of days
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();
  
  // Get tasks with due dates
  const tasksWithDates = tasks.filter(task => task.dueDate);
  
  // Group tasks by date
  const tasksByDate = {};
  tasksWithDates.forEach(task => {
    const dateKey = task.dueDate.split('T')[0];
    if (!tasksByDate[dateKey]) {
      tasksByDate[dateKey] = [];
    }
    tasksByDate[dateKey].push(task);
  });
  
  const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown';
  };
  
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };
  
  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  const isToday = (day) => {
    const today = new Date();
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  };
  
  const renderCalendarDays = () => {
    const days = [];
    
    // Empty cells for days before the first day of month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(
        <div key={`empty-${i}`} className={`p-2 min-h-[100px] ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}></div>
      );
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayTasks = tasksByDate[dateKey] || [];
      const isPastDue = new Date(dateKey) < new Date(new Date().toDateString());
      
      days.push(
        <div 
          key={day} 
          className={`p-2 min-h-[100px] border ${
            darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
          } ${isToday(day) ? 'ring-2 ring-blue-500' : ''}`}
        >
          <div className={`text-sm font-medium mb-1 ${
            isToday(day) 
              ? 'text-blue-500' 
              : darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {day}
          </div>
          <div className="space-y-1 overflow-y-auto max-h-[80px]">
            {dayTasks.map(task => (
              <div
                key={task.id}
                onClick={() => onTaskClick(task)}
                className={`text-xs p-1 rounded cursor-pointer truncate transition-colors ${
                  isPastDue && !task.completed
                    ? 'bg-red-100 text-red-800 hover:bg-red-200'
                    : darkMode 
                      ? 'bg-blue-900 text-blue-200 hover:bg-blue-800' 
                      : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                }`}
                title={`${task.title} - ${getProjectName(task.projectId)}`}
              >
                {task.title}
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    return days;
  };
  
  return (
    <div className={`h-full flex flex-col ${darkMode ? 'text-white' : 'text-gray-900'}`}>
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={goToPreviousMonth}
            className={`p-2 rounded-lg transition-colors ${
              darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
            }`}
          >
            ◀
          </button>
          <h2 className="text-xl font-bold min-w-[200px] text-center">
            {monthNames[month]} {year}
          </h2>
          <button
            onClick={goToNextMonth}
            className={`p-2 rounded-lg transition-colors ${
              darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
            }`}
          >
            ▶
          </button>
        </div>
        <button
          onClick={goToToday}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Today
        </button>
      </div>
      
      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-px mb-px">
        {dayNames.map(day => (
          <div 
            key={day} 
            className={`p-2 text-center font-medium ${
              darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
            }`}
          >
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-px flex-1 overflow-auto">
        {renderCalendarDays()}
      </div>
      
      {/* Legend */}
      <div className={`mt-4 flex items-center gap-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded ${darkMode ? 'bg-blue-900' : 'bg-blue-100'}`}></div>
          <span>Upcoming</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-red-100"></div>
          <span>Overdue</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded ring-2 ring-blue-500"></div>
          <span>Today</span>
        </div>
      </div>
    </div>
  );
}

export default CalendarView;
