import { useEffect, useState } from 'react';

const usePercentOfCompletedTasksCount = (tasks: { completed: boolean }[]) => {
    const [PercentOfCompletedTasksCount, setPercentOfCompletedTasksCount] = useState(0);

    useEffect(() => {
        const count = tasks.filter(task => task.completed).length;
        const count2 = tasks.length
        const percent = (count/count2)*100
        setPercentOfCompletedTasksCount(percent);
    }, [tasks]);

    return PercentOfCompletedTasksCount;
};

export default usePercentOfCompletedTasksCount;