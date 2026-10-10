
import { useState } from "react";
import {
    CheckCircle2,
    Plus,
    Trash2,
    X,
} from "lucide-react";

import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";
import { useTask } from "../context/TaskContext";

function getTaskCreatedTime(task) {
    if (task.createdAt) {
        const timestamp = new Date(task.createdAt).getTime();

        if (!Number.isNaN(timestamp)) {
            return timestamp;
        }
    }

    const numericId = Number(task.id);

    return Number.isFinite(numericId) ? numericId : 0;
}

function Tasks() {
    const [showForm, setShowForm] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [notice, setNotice] = useState(null);
    const [filter, setFilter] = useState("Semua");

    const { tasks } = useTask();

    const filteredTasks = tasks.filter((task) => {
        if (filter === "Selesai") {
            return task.completed;
        }

        if (filter === "Belum Selesai") {
            return !task.completed;
        }

        return true;
    });

    const handleTaskDeleted = () => {
        setNotice({
            type: "delete",
            message: "Tugas berhasil dihapus.",
        });
    };

    const handleEdit = (task) => {
        setEditingTask(task);
        setShowForm(true);
    };

    const handleTaskSuccess = (type) => {
        setShowForm(false);
        setEditingTask(null);

        setNotice({
            type: "success",
            message:
                type === "created"
                    ? "Tugas berhasil dibuat."
                    : "Tugas berhasil diperbarui.",
        });
    };

    const handleAddTask = () => {
        setEditingTask(null);
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingTask(null);
    };

    const sortedTasks = [...filteredTasks].sort(
        (a, b) => getTaskCreatedTime(b) - getTaskCreatedTime(a)
    );

    return (
        <>
            <div>
                {/* Header halaman */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm font-medium text-textMuted">
                            Atur kegiatan kuliahmu
                        </p>

                        <h1 className="mt-1 text-2xl font-extrabold text-gray-800 sm:text-3xl">
                            Daftar Tugas
                        </h1>

                        <p className="mt-2 text-sm text-textMuted">
                            Kelola deadline, prioritas, dan progres tugasmu.
                        </p>
                    </div>

                    <button
                        onClick={handleAddTask}
                        className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                    >
                        <Plus size={18} />
                        Tambah Tugas
                    </button>
                </div>

                {/* Filter tugas */}
                <div className="mt-6 flex flex-wrap gap-2">
                    {[
                        "Semua",
                        "Belum Selesai",
                        "Selesai",
                    ].map((item) => (
                        <button
                            key={item}
                            onClick={() => setFilter(item)}
                            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${filter === item
                                    ? "bg-primary text-white"
                                    : "bg-white text-textMuted hover:bg-gray-100"
                                }`}
                        >
                            {item}
                        </button>
                    ))}
                </div>

                {/* Daftar tugas */}
                <div className="mt-6">
                    {tasks.length === 0 ? (
                        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
                            <CheckCircle2
                                size={36}
                                className="mx-auto text-primary"
                            />

                            <h2 className="mt-4 font-bold text-gray-800">
                                Belum ada tugas
                            </h2>

                            <p className="mt-2 text-sm text-textMuted">
                                Tambahkan tugas pertamamu agar semua
                                kegiatan kuliah lebih teratur.
                            </p>

                            <button
                                onClick={handleAddTask}
                                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                            >
                                <Plus size={17} />
                                Tambah Tugas
                            </button>
                        </div>
                    ) : filteredTasks.length === 0 ? (
                        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
                            <p className="font-semibold text-gray-800">
                                Tidak ada tugas
                            </p>

                            <p className="mt-2 text-sm text-textMuted">
                                Tidak ada tugas dengan status "{filter}".
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3" >
                            {sortedTasks.map((task) => (
                                <TaskCard
                                    key={task.id}
                                    id={task.id}
                                    title={task.title}
                                    course={task.course}
                                    deadline={task.deadline}
                                    deadlineTime={task.deadlineTime}
                                    priority={task.priority}
                                    completed={task.completed}
                                    onDeleteSuccess={handleTaskDeleted}
                                    onEdit={() => handleEdit(task)}
                                />
                                
                            ))}
                            
                            
                        </div>
                    )}
                </div>
            </div>

            {/* Modal tambah atau edit tugas */}
            {showForm && (
                <div
                    className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 px-4 py-4 sm:py-6"
                    onClick={closeForm}
                >
                    <div
                        className="relative w-full max-w-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={closeForm}
                            aria-label="Tutup formulir"
                            className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200"
                        >
                            <X size={20} />
                        </button>

                        <TaskForm
                            key={editingTask?.id || "new-task"}
                            task={editingTask}
                            onSuccess={handleTaskSuccess}
                        />
                    </div>
                </div>
            )}

            {/* Notifikasi */}
            {notice && (
                <div
                    className={`fixed right-6 top-6 z-[60] flex max-w-sm items-start gap-3 rounded-2xl border p-4 shadow-lg ${notice.type === "success"
                            ? "border-green-200 bg-green-50"
                            : "border-red-200 bg-red-50"
                        }`}
                >
                    {notice.type === "success" ? (
                        <CheckCircle2
                            size={21}
                            className="mt-0.5 shrink-0 text-green-500"
                        />
                    ) : (
                        <Trash2
                            size={21}
                            className="mt-0.5 shrink-0 text-red-500"
                        />
                    )}

                    <p
                        className={`flex-1 text-sm font-semibold ${notice.type === "success"
                                ? "text-green-700"
                                : "text-red-700"
                            }`}
                    >
                        {notice.message}
                    </p>

                    <button
                        onClick={() => setNotice(null)}
                        aria-label="Tutup notifikasi"
                        className={
                            notice.type === "success"
                                ? "text-green-600"
                                : "text-red-600"
                        }
                    >
                        <X size={18} />
                    </button>
                </div>
            )}
        </>
    );
}


export default Tasks;
