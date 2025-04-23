import { useEffect, useState } from 'react';

const useCompletedTasks = (tasks: { completed: boolean }[]) => {
    const [completedTasksCount, setCompletedTasksCount] = useState(0);

    useEffect(() => {
        const count = tasks.filter(task => task.completed).length;
        setCompletedTasksCount(count);
    }, [tasks]);

    return completedTasksCount;
};

export default useCompletedTasks;