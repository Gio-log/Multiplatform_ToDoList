import React, { useRef } from "react";
import { Task } from "../App";
import "./TaskList.scss";
import { motion, AnimatePresence, useScroll} from "framer-motion";

interface TaskListProps {
    tasks: Task[];
    onToggleTaskCompletion: (id: number) => void;
    onDeleteTask: (id: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onToggleTaskCompletion, onDeleteTask }) => {
    const {scrollYProgress} = useScroll();
    const containerRef = useRef<HTMLDivElement>(null);
    return (
        <div>
            <div className="scroll-container">
                <motion.div className="scroll-progress scroll-progress-active" style={{scaleX: scrollYProgress}} 
                />
            </div>
            <div ref={containerRef}>
                <ul className="task-list">
                    <AnimatePresence>
                        {tasks.map((task, index) => (
                            <motion.li
                                key={task.id} 

                                layout
                                    
                                className={`task ${task.completed ? 'completed-task' : ''}`}
                                initial={{ opacity: 0, x: -100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 100 }}
                                whileHover={{scale: 1.05 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}>
                                    <span>{task.name}</span>
                                    <div>
                                        <button onClick={() => 
                                            onToggleTaskCompletion(task.id)}
                                            className="completion-button">
                                            {task.completed ? 'Undo' : 'Complete'}
                                        </button>
                                        <button onClick={() => 
                                            onDeleteTask(task.id)} 
                                            className="delete-btn">
                                            Delete
                                        </button>
                                    </div>
                                </motion.li>
                            ))}
                    </AnimatePresence>
                </ul>
            </div>
        </div>
    );
};

export default TaskList;