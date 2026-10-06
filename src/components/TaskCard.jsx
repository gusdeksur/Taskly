import { useState } from "react";
import {
    AlertTriangle,
    CheckCircle2,
    Circle,
    Pencil,
    Trash2,
    X,
} from "lucide-react";
import { useTask } from "../context/TaskContext";

function TaskCard({
    id,
    title,
    course,
    deadline,
    priority,
    completed,
    onDeleteSuccess,
    onEdit,
}) {
    const { toggleTask, removeTask } = useTask();

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const formatDeadline = (date) => {
        const [year, month, day] = date.split("-");

        const monthNames = [
            "Januari",
            "Februari",
            "Maret",
            "April",
            "Mei",
            "Juni",
            "Juli",
            "Agustus",
            "September",
            "Oktober",
            "November",
            "Desember",
        ];

        return `${Number(day)} ${monthNames[Number(month) - 1]} ${year}`;
    };

    const formattedDeadline = formatDeadline(deadline);

    const priorityStyle = {
        Rendah: "bg-gray-100 text-gray-600",
        Sedang: "bg-primary/10 text-primary",
        Tinggi: "bg-secondary/15 text-secondary",
    };

    const handleDelete = () => {
        removeTask(id);
        setShowDeleteModal(false);
        onDeleteSuccess();
    };

    const getDeadlineStatus = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [year, month, day] = deadline.split("-");

        const deadlineDate = new Date(
            Number(year),
            Number(month) - 1,
            Number(day)
        );

        deadlineDate.setHours(0, 0, 0, 0);

        const difference =
            deadlineDate.getTime() - today.getTime();

        const daysLeft =
            Math.ceil(
                difference / (1000 * 60 * 60 * 24)
            );

        if (completed) {
            return {
                text: "Selesai",
                style: "text-green-500",
            };
        }

        if (daysLeft < 0) {
            return {
                text: "Terlambat",
                style: "text-red-500",
            };
        }

        if (daysLeft === 0) {
            return {
                text: "Hari ini",
                style: "text-secondary",
            };
        }

        if (daysLeft === 1) {
            return {
                text: "Besok",
                style: "text-secondary",
            };
        }

        return {
            text: `${daysLeft} hari lagi`,
            style: "text-primary",
        };
    };

    const deadlineStatus = getDeadlineStatus();

    return (
        <>
            <div className="flex h-full flex-col rounded-2xl bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">
                            {title}
                        </h3>

                        <p className="mt-1 text-sm text-textMuted">
                            {course}
                        </p>
                    </div>

                    <span
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${priorityStyle[priority]
                            }`}
                    >
                        {priority}
                    </span>
                </div>

                <div className="mt-5">
                    <p className="text-sm text-textMuted">
                        Deadline: {formattedDeadline}
                    </p>

                    <p
                        className={`mt-1 text-sm font-semibold ${deadlineStatus.style}`}
                    >
                        {deadlineStatus.text}
                    </p>
                </div>

                <div className="mt-4 flex items-center gap-2">
                    {completed ? (
                        <>
                            <CheckCircle2
                                size={19}
                                className="text-green-500"
                            />

                            <span className="text-sm font-semibold text-green-500">
                                Selesai
                            </span>
                        </>
                    ) : (
                        <>
                            <Circle
                                size={19}
                                className="text-textMuted"
                            />

                            <span className="text-sm font-semibold text-textMuted">
                                Belum selesai
                            </span>
                        </>
                    )}
                </div>

                <div className="mt-auto flex gap-2 pt-5">
                    <button
                        onClick={() => toggleTask(id)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                    >
                        {completed ? (
                            "Belum selesai"
                        ) : (
                            <>
                                <CheckCircle2 size={17} />
                                Selesai
                            </>
                        )}
                    </button>

                    <button
                        onClick={() => onEdit()}
                        className="flex items-center justify-center rounded-xl bg-gray-100 px-3 py-2.5 text-gray-600 transition hover:bg-gray-200"
                        title="Edit tugas"
                    >
                        <Pencil size={18} />
                    </button>

                    <button
                        onClick={() => setShowDeleteModal(true)}
                        className="flex items-center justify-center rounded-xl bg-red-500 px-3 py-2.5 text-white transition hover:bg-red-600"
                        title="Hapus tugas"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>


            </div>

            {/* Modal konfirmasi hapus */}
            {showDeleteModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
                    onClick={() => setShowDeleteModal(false)}
                >
                    <div
                        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                                <AlertTriangle
                                    size={24}
                                    className="text-red-500"
                                />
                            </div>

                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <h3 className="mt-5 text-xl font-bold text-gray-800">
                            Hapus tugas?
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-textMuted">
                            Apakah kamu yakin ingin menghapus tugas{" "}
                            <span className="font-semibold text-gray-700">
                                "{title}"
                            </span>
                            ? Tugas yang sudah dihapus tidak dapat
                            dikembalikan.
                        </p>

                        <div className="mt-6 flex gap-3">
                            <button
                                onClick={() =>
                                    setShowDeleteModal(false)
                                }
                                className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
                            >
                                Batal
                            </button>

                            <button
                                onClick={handleDelete}
                                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
                            >
                                <Trash2 size={17} />
                                Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default TaskCard;