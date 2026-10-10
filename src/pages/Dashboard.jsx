
import {
    ArrowRight,
    CheckCircle2,
    Circle,
    Clock3,
} from "lucide-react";
import { Link } from "react-router-dom";

import TaskStats from "../components/TaskStats";
import { useTask } from "../context/TaskContext";

function getDaysUntil(deadline) {
    if (!deadline) return null;

    const [year, month, day] = deadline.split("-").map(Number);

    const deadlineDate = new Date(year, month - 1, day);
    const today = new Date();

    if (Number.isNaN(deadlineDate.getTime())) return null;

    deadlineDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    return Math.round(
        (deadlineDate.getTime() - today.getTime()) /
        (1000 * 60 * 60 * 24)
    );
}

function formatDate(deadline) {
    if (!deadline) return "Tanggal belum tersedia";

    const [year, month, day] = deadline.split("-").map(Number);

    const date = new Date(year, month - 1, day);

    return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(date);
}

function getRelativeDate(deadline) {
    const days = getDaysUntil(deadline);

    if (days === null) return "Tanggal belum tersedia";
    if (days < 0) return "Terlambat";
    if (days === 0) return "Hari ini";
    if (days === 1) return "Besok";

    if (days <= 3) {
        return `${days} hari lagi`;
    }

    const [year, month, day] = deadline.split("-").map(Number);

    const date = new Date(year, month - 1, day);

    return new Intl.DateTimeFormat("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
    }).format(date);
}

function sortTasksByDeadline(tasks) {
    return [...tasks].sort((a, b) => {
        const dateA =
            `${a.deadline || "9999-12-31"}T${a.deadlineTime || "09:00"}`;

        const dateB =
            `${b.deadline || "9999-12-31"}T${b.deadlineTime || "09:00"}`;

        return dateA.localeCompare(dateB);
    });
}

function TaskRow({ task, onToggle, section }) {
    const isOverdue = section === "overdue";

    const statusStyle = task.completed
        ? "bg-green-50 text-green-600"
        : isOverdue
            ? "bg-red-50 text-red-600"
            : section === "today"
                ? "bg-secondary/15 text-amber-700"
                : "bg-primary/10 text-primary";

    return (
        <div className="flex items-start gap-3 rounded-xl border border-gray-100 p-4 transition hover:border-gray-200">
            <button
                type="button"
                onClick={() => onToggle(task.id)}
                aria-label={
                    task.completed
                        ? `Tandai ${task.title} belum selesai`
                        : `Tandai ${task.title} selesai`
                }
                aria-pressed={task.completed}
                className="mt-0.5 shrink-0 rounded-full transition hover:scale-105"
            >
                {task.completed ? (
                    <CheckCircle2
                        size={23}
                        className="text-green-500"
                    />
                ) : (
                    <Circle
                        size={23}
                        className="text-textMuted hover:text-primary"
                    />
                )}
            </button>

            <div className="min-w-0 flex-1">
                <p
                    className={`break-words font-semibold ${
                        task.completed
                            ? "text-textMuted line-through"
                            : "text-gray-800"
                    }`}
                >
                    {task.title}
                </p>

                <p className="mt-1 text-sm text-textMuted">
                    {task.course}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyle}`}
                    >
                        {task.completed
                            ? "Selesai"
                            : getRelativeDate(task.deadline)}
                    </span>

                    <span className="text-xs text-textMuted">
                        {formatDate(task.deadline)}
                    </span>
                </div>

                <p className="mt-2 flex items-center gap-1.5 text-xs text-textMuted">
                    <Clock3 size={14} />
                    Pukul {task.deadlineTime || "09:00"} WITA
                </p>
            </div>

            <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                    task.priority === "Tinggi"
                        ? "bg-secondary/15 text-amber-700"
                        : task.priority === "Rendah"
                            ? "bg-gray-100 text-gray-600"
                            : "bg-primary/10 text-primary"
                }`}
            >
                {task.priority}
            </span>
        </div>
    );
}

function TaskSection({
    title,
    description,
    tasks,
    section,
    onToggle,
    emptyText,
}) {
    return (
        <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h2 className="text-lg font-bold text-gray-800">
                        {title}
                    </h2>

                    <p className="mt-1 text-sm text-textMuted">
                        {description}
                    </p>
                </div>

                <span className="shrink-0 rounded-full bg-background px-3 py-1 text-sm font-semibold text-textMuted">
                    {tasks.length}
                </span>
            </div>

            <div className="mt-5 space-y-3">
                {tasks.length === 0 ? (
                    <div className="rounded-xl bg-background px-4 py-6 text-center">
                        <p className="text-sm text-textMuted">
                            {emptyText}
                        </p>
                    </div>
                ) : (
                    tasks.map((task) => (
                        <TaskRow
                            key={task.id}
                            task={task}
                            section={section}
                            onToggle={onToggle}
                        />
                    ))
                )}
            </div>
        </section>
    );
}

function Dashboard() {
    const { tasks, toggleTask } = useTask();

    const completedTasks = tasks.filter(
        (task) => task.completed
    );

    const incompleteTasks = tasks.filter(
        (task) => !task.completed
    );

    const totalTasks = tasks.length;

    const progressPercentage = totalTasks === 0
        ? 0
        : Math.round(
            (completedTasks.length / totalTasks) * 100
        );

    const circumference = 2 * Math.PI * 48;

    const progressOffset =
        circumference * (1 - progressPercentage / 100);

    const sortedTasks = sortTasksByDeadline(tasks);

    const overdueTasks = sortedTasks.filter(
        (task) =>
            !task.completed &&
            getDaysUntil(task.deadline) !== null &&
            getDaysUntil(task.deadline) < 0
    );

    const todayTasks = sortedTasks.filter(
        (task) => getDaysUntil(task.deadline) === 0
    );

    const upcomingTasks = sortedTasks.filter(
        (task) => {
            const days = getDaysUntil(task.deadline);

            return days !== null && days > 0;
        }
    );

    return (
        <div>
            {/* Judul Dashboard */}
            <div>
                <p className="text-sm font-medium text-textMuted">
                    Selamat datang
                </p>

                <h1 className="mt-1 text-2xl font-extrabold text-gray-800 sm:text-3xl">
                    Dashboard
                </h1>

                <p className="mt-2 text-sm text-textMuted">
                    Pantau progres dan selesaikan tugas kuliahmu.
                </p>
            </div>

            {/* Statistik utama */}
            <div className="mt-6">
                <TaskStats />
            </div>

            <div className="mt-6 grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
                {/* Daftar tugas berdasarkan deadline */}
                <div className="space-y-6 lg:col-span-2">
                    <TaskSection
                        title="Tugas Terlambat"
                        description="Tugas yang deadline-nya sudah lewat."
                        tasks={overdueTasks}
                        section="overdue"
                        onToggle={toggleTask}
                        emptyText="Tidak ada tugas yang terlambat. Bagus!"
                    />

                    <TaskSection
                        title="Hari Ini"
                        description="Tugas yang perlu kamu perhatikan hari ini."
                        tasks={todayTasks}
                        section="today"
                        onToggle={toggleTask}
                        emptyText="Tidak ada tugas dengan deadline hari ini."
                    />

                    <TaskSection
                        title="Mendatang"
                        description="Persiapkan tugas sebelum deadline tiba."
                        tasks={upcomingTasks}
                        section="upcoming"
                        onToggle={toggleTask}
                        emptyText="Belum ada tugas mendatang."
                    />

                    <Link
                        to="/tasks"
                        className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-primary transition hover:bg-gray-50"
                    >
                        Kelola Semua Tugas
                        <ArrowRight size={17} />
                    </Link>
                </div>

                {/* Progres pengerjaan */}
                <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
                    <h2 className="text-lg font-bold text-gray-800">
                        Progres Tugas
                    </h2>

                    <p className="mt-1 text-sm text-textMuted">
                        Pantau pencapaianmu saat ini.
                    </p>

                    {/* Lingkaran progres */}
                    <div className="mt-6 flex justify-center">
                        <div
                            className="relative h-44 w-44"
                            role="img"
                            aria-label={`Sebanyak ${progressPercentage}% tugas telah selesai`}
                        >
                            <svg
                                viewBox="0 0 120 120"
                                className="h-full w-full -rotate-90"
                            >
                                <circle
                                    cx="60"
                                    cy="60"
                                    r="48"
                                    fill="none"
                                    stroke="#E5E7EB"
                                    strokeWidth="10"
                                />

                                <circle
                                    cx="60"
                                    cy="60"
                                    r="48"
                                    fill="none"
                                    stroke="#22C55E"
                                    strokeWidth="10"
                                    strokeLinecap="round"
                                    strokeDasharray={circumference}
                                    strokeDashoffset={progressOffset}
                                    className="transition-all duration-700 ease-out"
                                />
                            </svg>

                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-4xl font-extrabold text-gray-800">
                                    {progressPercentage}%
                                </span>

                                <span className="mt-1 text-xs text-textMuted">
                                    Terselesaikan
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <CheckCircle2
                                    size={19}
                                    className="text-green-500"
                                />

                                <span className="text-sm text-textMuted">
                                    Selesai
                                </span>
                            </div>

                            <span className="font-bold text-gray-800">
                                {completedTasks.length}
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Circle
                                    size={19}
                                    className="text-textMuted"
                                />

                                <span className="text-sm text-textMuted">
                                    Belum selesai
                                </span>
                            </div>

                            <span className="font-bold text-gray-800">
                                {incompleteTasks.length}
                            </span>
                        </div>

                        <div className="border-t border-gray-100 pt-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-textMuted">
                                    Total tugas
                                </span>

                                <span className="font-bold text-gray-800">
                                    {totalTasks}
                                </span>
                            </div>
                        </div>
                    </div>

                    <Link
                        to="/tasks"
                        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                    >
                        Buka Daftar Tugas
                        <ArrowRight size={17} />
                    </Link>
                </section>
            </div>
        </div>
    );
}

export default Dashboard;
