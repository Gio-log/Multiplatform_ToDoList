import React, { useState, useRef, useEffect } from "react";

interface TaskFormProps {
    onAddTask: (task: string) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onAddTask }) => {
    const [taskName, setTaskName] = useState('');
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (taskName.trim()) {
            onAddTask(taskName);
            setTaskName('');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                ref={inputRef}
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="Add a new task"
            />
            <button type="submit">Add Task</button>
        </form>
    );
};

export default TaskForm;