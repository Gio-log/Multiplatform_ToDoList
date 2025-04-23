import React, { useEffect, useState } from 'react';
import TaskList from "./TaskList/TaskList";
import TaskForm from "./TaskForm/TaskForm";
import useCompletedTasks from './hooks/useCompletedTasks';
import useAllTasks from './hooks/useAllTasks';
import usePercentOfCompletedTasksCount from './hooks/usePercentOfCompletedTasks';
import useIncompleteTasks from './hooks/useIncompleteTasks';
import TaskFilter from "./TaskList/TaskFilter";
import './App.scss'

export interface Task {
  id: number;
  name: string;
  completed: boolean;
}

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const fetchTasks = async () => {
    try {
      const response = await fetch("http://localhost:8080/tasks");
      if(!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      const fetchedTasks = data.tasks;
      if (Array.isArray(fetchedTasks)) {
        setTasks(fetchedTasks);
      } else {
        throw new Error("Fetched tasks data is not an array");
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (taskName: string) => {
    const newTask: Omit<Task, 'id'> = {
      name: taskName,
      completed: false,
    };

    try{
      const response = await fetch("http://localhost:8080/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const responseJson = await response.json();
      const createdTask: Task = responseJson.task;
      setTasks((prevTasks) => [createdTask, ...prevTasks ]);
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  const toggleTaskCompletion = async (id: number) => {
    const taskToUpdate = tasks.find((task) => task.id === id);
    if (!taskToUpdate) return;

    const updatedTask = { ...taskToUpdate, completed: !taskToUpdate.completed };

    try {
      const response = await fetch(`http://localhost:8080/tasks/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed: updatedTask.completed }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const responseJson = await response.json();
    const updatedTaskFromServer: Task = responseJson.task;

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? updatedTaskFromServer : task
      )
    );
    }catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const completedTasksCount = useCompletedTasks(tasks);
  const allTasksCount = useAllTasks(tasks);
  const percentOfCompletedTasksCount = usePercentOfCompletedTasksCount(tasks);
  const incompleteTasksCount = useIncompleteTasks(tasks);

  const handleFilterChange = (filter: string) => {
    setFilter(filter);
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'incomplete') return !task.completed;
    return true;
  })

  const deleteTask = async (id: number) => {
    try{
      const response = await fetch(`http://localhost:8080/tasks/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  return (
    <>
      <div className="App">
        <h1>To-Do List</h1>
        <TaskFilter onFilterChange={handleFilterChange} currentFilter={filter}/>
        <TaskForm onAddTask={addTask} />
        <TaskList 
          key={tasks.length}
          tasks={filteredTasks} 
          onToggleTaskCompletion={toggleTaskCompletion} 
          onDeleteTask={deleteTask}
          />
        <p>Completed Tasks: {completedTasksCount}</p>
        <p>All Tasks: {allTasksCount}</p>
        <p>Percent of Tasks Completed: {percentOfCompletedTasksCount}%</p>
        <p>Things left to do: {incompleteTasksCount}</p>
      </div>
    </>
  );
};



export default App
