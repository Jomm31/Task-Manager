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
  const dayNamesShort = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  
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
        <div key={`empty-${i}`} className={`p-2 min-h-[100px] ${darkMode ? 'bg-raisin/50' : 'bg-lavender/30'}`}></div>
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
            darkMode ? 'border-ceil/30 bg-raisin/80' : 'border-lavender bg-white'
          } ${isToday(day) ? 'ring-2 ring-ceil' : ''}`}
        >
          <div className={`text-sm font-medium mb-1 ${
            isToday(day) 
              ? 'text-ceil' 
              : darkMode ? 'text-lavender' : 'text-raisin'
          }`}>
            {day}
          </div>
          <div className="space-y-1 overflow-y-auto max-h-[80px] scrollbar-thin scrollbar-thumb-ceil/20 scrollbar-track-transparent">
            {dayTasks.map(task => (
              <div
                key={task.id}
                onClick={() => onTaskClick(task)}
                className={`text-xs p-1 rounded cursor-pointer truncate transition-colors ${
                  isPastDue && !task.completed
                    ? 'bg-rose/30 text-rose hover:bg-rose/50'
                    : darkMode 
                      ? 'bg-ceil/30 text-lavender hover:bg-ceil/50' 
                      : 'bg-ceil/20 text-raisin hover:bg-ceil/40'
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
    <div className={`h-full flex flex-col ${darkMode ? 'text-lavender' : 'text-raisin'}`}>
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={goToPreviousMonth}
            className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
              darkMode ? 'hover:bg-ceil/30' : 'hover:bg-lavender'
            }`}
          >
            ◀
          </button>
          <h2 className="text-base sm:text-xl font-bold min-w-[140px] sm:min-w-[200px] text-center">
            {monthNames[month]} {year}
          </h2>
          <button
            onClick={goToNextMonth}
            className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
              darkMode ? 'hover:bg-ceil/30' : 'hover:bg-lavender'
            }`}
          >
            ▶
          </button>
        </div>
        <button
          onClick={goToToday}
          className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base bg-ceil text-raisin rounded-lg hover:bg-ceil/80 transition-colors"
        >
          Today
        </button>
      </div>
      
      {/* Scrollable Calendar Container */}
      <div className="flex-1 overflow-auto rounded-lg shadow-inner bg-black/5 relative">
        <div className="min-w-[800px] h-full flex flex-col">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-px mb-px shrink-0 sticky top-0 z-10 shadow-sm">
            {dayNames.map((day, idx) => (
              <div 
                key={day} 
                className={`p-2 text-center text-sm font-medium ${
                  darkMode ? 'bg-ceil/20 text-lavender' : 'bg-lavender text-raisin'
                }`}
              >
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-px flex-1 auto-rows-fr">
            {renderCalendarDays()}
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-silver shrink-0">
        <div className="flex items-center gap-1 sm:gap-2">

          <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded ${darkMode ? 'bg-ceil/30' : 'bg-ceil/20'}`}></div>
          <span>Upcoming</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded bg-rose/30"></div>
          <span>Overdue</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded ring-2 ring-ceil"></div>
          <span>Today</span>
        </div>
      </div>
    </div>
  );
}

export default CalendarView;
