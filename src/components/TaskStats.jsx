import {
    CheckCircle2,
    Circle,
    ListTodo,
} from "lucide-react";
import { useTask } from "../context/TaskContext";

function TaskStats() {
    const { tasks } = useTask();

    const totalTasks = tasks.length;

    const completedTasks = tasks.filter(
        (task) => task.completed
    ).length;

    const incompleteTasks = tasks.filter(
        (task) => !task.completed
    ).length;

    const stats = [
        {
            title: "Total Tugas",
            value: totalTasks,
            icon: ListTodo,
            iconStyle: "text-primary bg-primary/10",
        },
        {
            title: "Belum Selesai",
            value: incompleteTasks,
            icon: Circle,
            iconStyle: "text-textMuted bg-gray-100",
        },
        {
            title: "Selesai",
            value: completedTasks,
            icon: CheckCircle2,
            iconStyle: "text-green-500 bg-green-50",
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                    <div
                        key={stat.title}
                        className="rounded-2xl bg-white p-5 shadow-sm"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-textMuted">
                                    {stat.title}
                                </p>

                                <p className="mt-2 text-3xl font-bold text-gray-800">
                                    {stat.value}
                                </p>
                            </div>

                            <div
                                className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.iconStyle}`}
                            >
                                <Icon size={22} />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default TaskStats;