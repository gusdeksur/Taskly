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
        const taskWithCreationTime = {
            ...newTask,
            createdAt: newTask.createdAt ?? new Date().toISOString(),
        };

        setTasks((currentTasks) => [
            ...currentTasks,
            taskWithCreationTime,
        ]);
    };

    const toggleTask = (id) => {
        setTasks((currentTasks) =>
            currentTasks.map((task) => {
                if (task.id !== id) {
                    return task;
                }

                const willComplete = !task.completed;

                return {
                    ...task,
                    completed: willComplete,
                    completedAt: willComplete
                        ? new Date().toISOString()
                        : null,
                };
            })
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