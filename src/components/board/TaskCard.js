import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';

function TaskCard({ task, onClick, onSetDueDate, darkMode, isDragging }) {
  const [hovered, setHovered] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [calendarPosition, setCalendarPosition] = useState({ top: 0, left: 0 });
  const calendarButtonRef = useRef(null);
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();
  
  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleDateClick = (e) => {
    e.stopPropagation();
    setCalendarDate(task.dueDate ? new Date(task.dueDate) : new Date());
    
    // Calculate position for the calendar popup
    if (calendarButtonRef.current) {
      const rect = calendarButtonRef.current.getBoundingClientRect();
      setCalendarPosition({
        top: rect.bottom + 4,
        left: Math.min(rect.right - 200, window.innerWidth - 220)
      });
    }
    
    setShowDatePicker(!showDatePicker);
  };

  const handleSelectDate = (day) => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    if (onSetDueDate) {
      onSetDueDate(task.id, dateStr);
    }
    setShowDatePicker(false);
  };

  const goToPrevMonth = (e) => {
    e.stopPropagation();
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1));
  };

  const goToNextMonth = (e) => {
    e.stopPropagation();
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1));
  };

  const renderCalendar = () => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const today = new Date();
    const selectedDate = task.dueDate ? new Date(task.dueDate) : null;

    const days = [];
    // Empty cells
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-7 h-7"></div>);
    }
    // Days
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
      const isSelected = selectedDate && day === selectedDate.getDate() && month === selectedDate.getMonth() && year === selectedDate.getFullYear();
      days.push(
        <button
          key={day}
          onClick={(e) => { e.stopPropagation(); handleSelectDate(day); }}
          className={`w-7 h-7 text-xs rounded-full flex items-center justify-center transition-colors
            ${isSelected ? 'bg-ceil text-raisin' : ''}
            ${isToday && !isSelected ? 'ring-1 ring-ceil' : ''}
            ${!isSelected ? (darkMode ? 'hover:bg-ceil/30' : 'hover:bg-lavender') : ''}
            ${darkMode ? 'text-lavender' : 'text-raisin'}
          `}
        >
          {day}
        </button>
      );
    }

    return (
      <div className={`p-2 rounded-lg shadow-lg ${darkMode ? 'bg-raisin border border-ceil/30' : 'bg-white border border-lavender'}`} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <button onClick={goToPrevMonth} className={`w-6 h-6 flex items-center justify-center rounded ${darkMode ? 'hover:bg-ceil/30 text-lavender' : 'hover:bg-lavender text-raisin'}`}>◀</button>
          <span className={`text-sm font-medium ${darkMode ? 'text-lavender' : 'text-raisin'}`}>{monthNames[month]} {year}</span>
          <button onClick={goToNextMonth} className={`w-6 h-6 flex items-center justify-center rounded ${darkMode ? 'hover:bg-ceil/30 text-lavender' : 'hover:bg-lavender text-raisin'}`}>▶</button>
        </div>
        {/* Day names */}
        <div className="grid grid-cols-7 gap-0.5 mb-1">
          {dayNames.map((d, i) => (
            <div key={i} className="w-7 h-5 text-[10px] flex items-center justify-center text-silver">{d}</div>
          ))}
        </div>
        {/* Days grid */}
        <div className="grid grid-cols-7 gap-0.5">
          {days}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`p-3 rounded-lg shadow mb-2 cursor-pointer transition-all duration-200 relative ${
        isDragging
          ? 'shadow-2xl ring-2 ring-ceil rotate-2 scale-105 z-10'
          : 'hover:shadow-lg hover:-translate-y-1'
      } ${
        darkMode ? 'bg-dusk hover:bg-dusk/80 border border-ceil/20' : 'bg-white hover:bg-white/90 border border-transparent hover:border-ceil/20'
      }`}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setShowDatePicker(false); }}
    >
      <h4 className={`font-medium break-words overflow-hidden transition-colors ${darkMode ? 'text-lavender' : 'text-raisin'}`} style={{ wordBreak: 'break-word' }}>
        {task.title}
      </h4>
      
      {/* Due date display */}
      {task.dueDate && (
        <p className={`text-sm mt-2 flex items-center gap-1 ${
          isOverdue 
            ? 'text-rose' 
            : 'text-silver'
        }`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.1,2H18V1c0-0.6-0.4-1-1-1s-1,0.4-1,1v1H8V1c0-0.6-0.4-1-1-1S6,0.4,6,1v1H4.9C2.2,2,0,4.2,0,6.9v12.1C0,21.8,2.2,24,4.9,24h14.1c2.7,0,4.9-2.2,4.9-4.9V6.9C24,4.2,21.8,2,19.1,2z M4.9,4H6v1c0,0.6,0.4,1,1,1s1-0.4,1-1V4h8v1c0,0.6,0.4,1,1,1s1-0.4,1-1V4h1.1C20.7,4,22,5.3,22,6.9V8H2V6.9C2,5.3,3.3,4,4.9,4z M19.1,22H4.9C3.3,22,2,20.7,2,19.1V10h20v9.1C22,20.7,20.7,22,19.1,22z"/>
          </svg>
          {formatDate(task.dueDate)}
        </p>
      )}

      {/* Calendar icon on hover */}
      {hovered && !task.dueDate && (
        <button
          ref={calendarButtonRef}
          className={`absolute top-2 right-2 p-1 rounded transition-colors ${darkMode ? 'hover:bg-ceil/30 text-silver' : 'hover:bg-lavender text-silver'}`}
          onClick={handleDateClick}
          title="Set due date"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.1,2H18V1c0-0.6-0.4-1-1-1s-1,0.4-1,1v1H8V1c0-0.6-0.4-1-1-1S6,0.4,6,1v1H4.9C2.2,2,0,4.2,0,6.9v12.1C0,21.8,2.2,24,4.9,24h14.1c2.7,0,4.9-2.2,4.9-4.9V6.9C24,4.2,21.8,2,19.1,2z M4.9,4H6v1c0,0.6,0.4,1,1,1s1-0.4,1-1V4h8v1c0,0.6,0.4,1,1,1s1-0.4,1-1V4h1.1C20.7,4,22,5.3,22,6.9V8H2V6.9C2,5.3,3.3,4,4.9,4z M19.1,22H4.9C3.3,22,2,20.7,2,19.1V10h20v9.1C22,20.7,20.7,22,19.1,22z"/>
          </svg>
        </button>
      )}

      {/* Date picker popup - rendered via portal */}
      {showDatePicker && createPortal(
        <div 
          className="fixed z-50"
          style={{ top: calendarPosition.top, left: calendarPosition.left }}
        >
          {renderCalendar()}
        </div>,
        document.body
      )}
    </div>
  );
}

export default TaskCard;
