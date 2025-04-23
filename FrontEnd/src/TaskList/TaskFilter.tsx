import React from "react";
import './TaskFilter.scss'

interface TaskFilterProps {
    onFilterChange: (filter: string) => void;
    currentFilter: string;
}

const TaskFilter: React.FC<TaskFilterProps> = ({ onFilterChange, currentFilter }) => {
    return (
        <div className="task-filter">
            <button
              className={currentFilter === 'all' ? 'active' : ''} 
              onClick={() => onFilterChange('all')}>
              All
            </button>
            <button
              className={currentFilter === 'completed' ? 'active' : ''} 
              onClick={() => onFilterChange('completed')}>
              Completed
            </button>
            <button
              className={currentFilter === 'incomplete' ? 'active' : ''} 
              onClick={() => onFilterChange('incomplete')}>
              Incomplete
            </button>
        </div>
    );
};

export default TaskFilter;