
import { useState } from "react";
import { AlertCircle } from "lucide-react";

import { useTask } from "../context/TaskContext";
import TimePicker from "./TimePicker";

function TaskForm({ task, onSuccess }) {
    const { addTask, updateTask } = useTask();

    const [title, setTitle] = useState(task?.title || "");
    const [course, setCourse] = useState(task?.course || "");
    const [deadline, setDeadline] = useState(task?.deadline || "");
    const [deadlineTime, setDeadlineTime] = useState(
        task?.deadlineTime || "09:00"
    );
    const [priority, setPriority] = useState(
        task?.priority || "Sedang"
    );
    const [errorMessage, setErrorMessage] = useState("");

    const isEditMode = Boolean(task);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!title.trim()) {
            setErrorMessage("Nama tugas wajib diisi.");
            return;
        }

        if (!course.trim()) {
            setErrorMessage("Mata kuliah wajib diisi.");
            return;
        }

        if (!deadline) {
            setErrorMessage("Tanggal deadline wajib dipilih.");
            return;
        }

        if (isEditMode) {
            const updatedTask = {
                ...task,
                title: title.trim(),
                course: course.trim(),
                deadline,
                deadlineTime,
                priority,
            };

            updateTask(updatedTask);
            onSuccess("updated");
        } else {
            const newTask = {
                id: Date.now(),
                title: title.trim(),
                course: course.trim(),
                deadline,
                deadlineTime,
                priority,
                completed: false,
            };

            addTask(newTask);
            onSuccess("created");
        }

        setTitle("");
        setCourse("");
        setDeadline("");
        setDeadlineTime("09:00");
        setPriority("Sedang");
        setErrorMessage("");
    };

    return (
        <form
            onSubmit={handleSubmit}
            noValidate
            className="rounded-2xl bg-white p-5 shadow-xl sm:p-6"
        >
            <h3 className="text-xl font-bold text-gray-800">
                {isEditMode ? "Edit Tugas" : "Tambah Tugas"}
            </h3>

            <p className="mt-1 text-sm leading-6 text-textMuted">
                {isEditMode
                    ? "Perbarui informasi tugasmu."
                    : "Tambahkan tugas baru agar kegiatan kuliahmu lebih teratur."}
            </p>

            {errorMessage && (
                <div className="mt-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
                    <AlertCircle
                        size={20}
                        className="mt-0.5 shrink-0 text-amber-500"
                    />

                    <p className="text-sm font-medium leading-5 text-amber-700">
                        {errorMessage}
                    </p>
                </div>
            )}

            <div className="mt-5">
                <label
                    htmlFor="task-title"
                    className="block text-sm font-semibold text-gray-700"
                >
                    Nama tugas
                </label>

                <input
                    id="task-title"
                    type="text"
                    placeholder="Contoh: Implementasi React"
                    value={title}
                    onChange={(e) => {
                        setTitle(e.target.value);
                        setErrorMessage("");
                    }}
                    className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
            </div>

            <div className="mt-4">
                <label
                    htmlFor="task-course"
                    className="block text-sm font-semibold text-gray-700"
                >
                    Mata kuliah
                </label>

                <input
                    id="task-course"
                    type="text"
                    placeholder="Contoh: Pemrograman Web"
                    value={course}
                    onChange={(e) => {
                        setCourse(e.target.value);
                        setErrorMessage("");
                    }}
                    className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
            </div>

            <div className="mt-4">
                <label
                    htmlFor="task-deadline"
                    className="block text-sm font-semibold text-gray-700"
                >
                    Tanggal deadline
                </label>

                <input
                    id="task-deadline"
                    type="date"
                    value={deadline}
                    onChange={(e) => {
                        setDeadline(e.target.value);
                        setErrorMessage("");
                    }}
                    className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
            </div>

            <div className="mt-4">
                <TimePicker
                    value={deadlineTime}
                    onChange={setDeadlineTime}
                />
            </div>

            <div className="mt-4">
                <label
                    htmlFor="task-priority"
                    className="block text-sm font-semibold text-gray-700"
                >
                    Prioritas
                </label>

                <select
                    id="task-priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                >
                    <option value="Rendah">Rendah</option>
                    <option value="Sedang">Sedang</option>
                    <option value="Tinggi">Tinggi</option>
                </select>
            </div>

            <div className="mt-5 rounded-xl bg-background p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-textMuted">
                    Ringkasan
                </p>

                <p className="mt-3 text-sm text-textMuted">
                    Tugas:{" "}
                    <span className="font-semibold text-gray-700">
                        {title || "Belum diisi"}
                    </span>
                </p>

                <p className="mt-1 text-sm text-textMuted">
                    Mata kuliah:{" "}
                    <span className="font-semibold text-gray-700">
                        {course || "Belum diisi"}
                    </span>
                </p>

                <p className="mt-1 text-sm text-textMuted">
                    Tanggal:{" "}
                    <span className="font-semibold text-gray-700">
                        {deadline || "Belum diisi"}
                    </span>
                </p>

                <p className="mt-1 text-sm text-textMuted">
                    Waktu:{" "}
                    <span className="font-semibold text-gray-700">
                        {deadlineTime}
                    </span>
                </p>

                <p className="mt-1 text-sm text-textMuted">
                    Prioritas:{" "}
                    <span className="font-semibold text-gray-700">
                        {priority}
                    </span>
                </p>
            </div>

            <button
                type="submit"
                className="mt-5 w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
                {isEditMode ? "Simpan Perubahan" : "Buat Tugas"}
            </button>
        </form>
    );
}

export default TaskForm;
