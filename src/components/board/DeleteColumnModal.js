import React from 'react';

function DeleteColumnModal({ 
  isOpen, 
  column, 
  completed, 
  incomplete, 
  totalTasks,
  deleteOption,
  onOptionChange,
  onCancel, 
  onDeleteKeepTasks, 
  onDeleteWithTasks 
}) {
  if (!isOpen || !column) return null;

  const handleDelete = () => {
    if (deleteOption === 'delete') {
      onDeleteWithTasks();
    } else {
      onDeleteKeepTasks();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-midnight/80 p-4">
      <div className="bg-dusk text-lavender rounded-lg shadow-xl p-4 sm:p-6 w-full max-w-md border border-ceil/30">
        <h2 className="text-lg font-bold mb-2 text-mist">
          Are you sure you want to delete this section?
        </h2>
        <p className="mb-4 text-mauve">
          This section <span className="font-semibold text-lavender">{column.name}</span> includes
          {completed > 0 && (
            <> <span className="font-semibold text-lavender">{completed}</span> completed task{completed > 1 ? 's' : ''}</>
          )}
          {completed > 0 && incomplete > 0 && ' and'}
          {incomplete > 0 && (
            <> <span className="font-semibold text-lavender">{incomplete}</span> incomplete task{incomplete > 1 ? 's' : ''}</>
          )}.
        </p>
        
        <div className="flex flex-col gap-2 mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="deleteOption"
              checked={deleteOption !== 'delete'}
              onChange={() => onOptionChange('keep')}
              className="accent-ceil"
            />
            <span className="text-lavender">
              Delete this section and keep these {incomplete} task{incomplete > 1 ? 's' : ''}
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="deleteOption"
              checked={deleteOption === 'delete'}
              onChange={() => onOptionChange('delete')}
              className="accent-ceil"
            />
            <span className="text-lavender">
              Delete this section and delete these {totalTasks} task{totalTasks !== 1 ? 's' : ''}
            </span>
          </label>
        </div>
        
        <div className="flex gap-2">
          <button
            className="flex-1 bg-ceil/30 hover:bg-ceil/50 text-lavender px-4 py-2 rounded"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="flex-1 bg-rose hover:bg-rose-dark text-mist px-4 py-2 rounded"
            onClick={handleDelete}
          >
            Delete Section
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteColumnModal;
