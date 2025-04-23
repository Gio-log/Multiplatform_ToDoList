import { useEffect, useState } from 'react';

const useAllTasks = (tasks: { completed: boolean }[]) => {
    const [allTasksCount, setAllTasksCount] = useState(0);

    useEffect(() => {
        setAllTasksCount(tasks.length);
    }, [tasks]);

    return allTasksCount;
};

export default useAllTasks;