import { createContext, useContext, useEffect, useState } from "react";

const TaskContext = createContext();

function TaskProvider({ children }) {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("taskly-tasks");

    if (savedTasks) {
      return JSON.parse(savedTasks);
    }

    return [];
  });

  useEffect(() => {
    localStorage.setItem("taskly-tasks", JSON.stringify(tasks));
  }, [tasks]);

    const addTask = (newTask) => {
        setTasks((currentTasks) => [
            ...currentTasks,
            newTask,
        ]);
    };

    const toggleTask = (id) => {
        setTasks((currentTasks) =>
            currentTasks.map((task) =>
                task.id === id
                    ? { ...task, completed: !task.completed }
                    : task
            )
        );
    };

    const removeTask = (id) => {
        setTasks((currentTasks) =>
            currentTasks.filter((task) => task.id !== id)
        );
    };

    const updateTask = (updatedTask) => {
        setTasks((currentTasks) =>
            currentTasks.map((task) =>
                task.id === updatedTask.id
                    ? updatedTask
                    : task
            )
        );
    };

    return (
        <TaskContext.Provider
            value={{
                tasks,
                addTask,
                toggleTask,
                removeTask,
                updateTask,
            }}
        >
            {children}
        </TaskContext.Provider>
    );
}

function useTask() {
    return useContext(TaskContext);
}

export { TaskContext, TaskProvider, useTask };