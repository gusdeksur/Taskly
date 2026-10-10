
import { useState } from "react";
import {
    Activity,
    AlertCircle,
    CalendarClock,
    CheckCircle2,
    Clock3,
    History,
    ListTodo,
    Target,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useTask } from "../context/TaskContext";

const WITA_OFFSET = 8 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

const PERIOD_OPTIONS = [
    { value: "week", label: "Minggu Ini" },
    { value: "month", label: "Bulan Ini" },
    { value: "lastMonth", label: "Bulan Lalu" },
    { value: "year", label: "Tahun Ini" },
    { value: "all", label: "Semua Waktu" },
];

function getWitaDateParts(date = new Date()) {
    const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Makassar",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).formatToParts(date);

    const getPart = (type) =>
        Number(parts.find((part) => part.type === type)?.value);

    return {
        year: getPart("year"),
        month: getPart("month"),
        day: getPart("day"),
    };
}

function getPeriodRange(period) {
    if (period === "all") {
        return { start: null, end: null };
    }

    const { year, month, day } = getWitaDateParts();

    const todayUtc = Date.UTC(year, month - 1, day);

    if (period === "week") {
        const weekday = new Date(todayUtc).getUTCDay();
        const daysSinceMonday = (weekday + 6) % 7;

        const start =
            Date.UTC(
                year,
                month - 1,
                day - daysSinceMonday
            ) - WITA_OFFSET;

        return {
            start,
            end: start + 7 * DAY_MS,
        };
    }

    if (period === "month") {
        return {
            start: Date.UTC(year, month - 1, 1) - WITA_OFFSET,
            end: Date.UTC(year, month, 1) - WITA_OFFSET,
        };
    }

    if (period === "lastMonth") {
        return {
            start: Date.UTC(year, month - 2, 1) - WITA_OFFSET,
            end: Date.UTC(year, month - 1, 1) - WITA_OFFSET,
        };
    }

    return {
        start: Date.UTC(year, 0, 1) - WITA_OFFSET,
        end: Date.UTC(year + 1, 0, 1) - WITA_OFFSET,
    };
}

function getCompletionInfo(task) {
    const completedAt = task.completedAt
        ? new Date(task.completedAt)
        : null;

    const validCompletedAt =
        completedAt && !Number.isNaN(completedAt.getTime())
            ? completedAt
            : null;

    if (!task.deadline) {
        return {
            status: "unrecorded",
            completedAt: validCompletedAt,
        };
    }

    const deadlineTime = task.deadlineTime || "09:00";

    const deadlineAt = new Date(
        `${task.deadline}T${deadlineTime}:00+08:00`
    );

    if (
        Number.isNaN(deadlineAt.getTime()) ||
        !validCompletedAt
    ) {
        return {
            status: "unrecorded",
            deadlineAt: Number.isNaN(deadlineAt.getTime())
                ? null
                : deadlineAt,
            completedAt: validCompletedAt,
        };
    }

    return {
        status:
            validCompletedAt.getTime() > deadlineAt.getTime()
                ? "late"
                : "on-time",
        deadlineAt,
        completedAt: validCompletedAt,
    };
}

function formatDateTime(date) {
    if (!date) return "Belum tersedia";

    return new Intl.DateTimeFormat("id-ID", {
        timeZone: "Asia/Makassar",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
    }).format(date);
}

function Reports() {
    const { tasks } = useTask();

    const [period, setPeriod] = useState("week");
    const [currentPage, setCurrentPage] = useState(1);

    const completedTasks = tasks.filter(
        (task) => task.completed
    );

    const periodRange = getPeriodRange(period);

    const isInPeriod = (task) => {
        // Semua Waktu juga menyertakan tugas lama
        // yang belum mempunyai completedAt.
        if (period === "all") return true;

        if (!task.completedAt) return false;

        const timestamp = new Date(task.completedAt).getTime();

        if (Number.isNaN(timestamp)) return false;

        return (
            timestamp >= periodRange.start &&
            timestamp < periodRange.end
        );
    };

    const selectedTasks = completedTasks.filter(isInPeriod);

    const records = selectedTasks.map((task) => ({
        ...task,
        completionInfo: getCompletionInfo(task),
    }));

    const onTimeTasks = records.filter(
        (task) => task.completionInfo.status === "on-time"
    );

    const lateTasks = records.filter(
        (task) => task.completionInfo.status === "late"
    );

    const unrecordedTasks = records.filter(
        (task) => task.completionInfo.status === "unrecorded"
    );

    // Data lama yang tidak mempunyai completedAt
    // tidak bisa dimasukkan secara akurat ke periode tertentu.
    const allUnrecordedTasks = completedTasks.filter(
        (task) => !task.completedAt ||
            Number.isNaN(new Date(task.completedAt).getTime())
    );

    const recordedCount = onTimeTasks.length + lateTasks.length;

    const punctualityRate =
        recordedCount === 0
            ? 0
            : Math.round(
                (onTimeTasks.length / recordedCount) * 100
            );

    const completionRate =
        selectedTasks.length === 0
            ? 0
            : Math.round(
                (selectedTasks.length / selectedTasks.length) * 100
            );

    const selectedPeriodLabel =
        PERIOD_OPTIONS.find(
            (option) => option.value === period
        )?.label || "Minggu Ini";

    const recentCompletions = [...records].sort(
        (a, b) => {
            const timeA =
                a.completionInfo.completedAt?.getTime() ?? 0;

            const timeB =
                b.completionInfo.completedAt?.getTime() ?? 0;

            return timeB - timeA;
        }
    );
    const itemsPerPage = 5;

    const totalPages = Math.ceil(
        recentCompletions.length / itemsPerPage
    );

    const safeCurrentPage = Math.min(
        currentPage,
        Math.max(totalPages, 1)
    );

    const startIndex = (safeCurrentPage - 1) * itemsPerPage;

    const paginatedTasks = recentCompletions.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    const firstItem =
        recentCompletions.length === 0 ? 0 : startIndex + 1;

    const lastItem = Math.min(
        startIndex + itemsPerPage,
        recentCompletions.length
    );
    ;

    const stats = [
        {
            title: "Tugas Selesai",
            value: selectedTasks.length,
            description: selectedPeriodLabel,
            icon: CheckCircle2,
            style: "bg-green-50 text-green-600",
        },
        {
            title: "Selesai Tepat Waktu",
            value: onTimeTasks.length,
            description: "Sebelum atau tepat pada deadline",
            icon: Target,
            style: "bg-primary/10 text-primary",
        },
        {
            title: "Terlambat Diselesaikan",
            value: lateTasks.length,
            description: "Selesai setelah deadline",
            icon: Clock3,
            style: "bg-amber-50 text-amber-600",
        },
        {
            title: "Ketepatan Waktu",
            value: `${punctualityRate}%`,
            description:
                `${recordedCount} tugas dengan waktu tercatat`,
            icon: Activity,
            style: "bg-violet-50 text-violet-600",
        },
    ];

    return (
        <div>
            {/* Header */}
            <div>
                <p className="text-sm font-medium text-textMuted">
                    Evaluasi progres belajarmu
                </p>

                <h1 className="mt-1 text-2xl font-extrabold text-gray-800 sm:text-3xl">
                    Laporan Produktivitas
                </h1>

                <p className="mt-2 text-sm leading-6 text-textMuted">
                    Lihat tugas yang telah diselesaikan dan evaluasi
                    ketepatan waktumu.
                </p>
            </div>

            {/* Filter periode */}
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <label
                    htmlFor="report-period"
                    className="text-sm font-semibold text-gray-700"
                >
                    Periode Laporan
                </label>

                <select
                    id="report-period"
                    value={period}
                    onChange={(event) => {
                        setPeriod(event.target.value);
                        setCurrentPage(1);
                    }}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 sm:w-56"
                >
                    {PERIOD_OPTIONS.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                        >
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Statistik */}
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;

                    return (
                        <div
                            key={stat.title}
                            className="rounded-2xl bg-white p-5 shadow-sm"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-sm font-medium text-textMuted">
                                        {stat.title}
                                    </p>

                                    <p className="mt-3 text-3xl font-extrabold text-gray-800">
                                        {stat.value}
                                    </p>
                                </div>

                                <div
                                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${stat.style}`}
                                >
                                    <Icon size={22} />
                                </div>
                            </div>

                            <p className="mt-3 text-xs leading-5 text-textMuted">
                                {stat.description}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* Pemberitahuan data lama */}
            {allUnrecordedTasks.length > 0 && (
                <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                    <AlertCircle
                        size={21}
                        className="mt-0.5 shrink-0 text-amber-600"
                    />

                    <div>
                        <p className="font-semibold text-amber-800">
                            Ada riwayat yang belum lengkap
                        </p>

                        <p className="mt-1 text-sm leading-6 text-amber-700">
                            {allUnrecordedTasks.length} tugas selesai belum
                            mempunyai waktu penyelesaian yang valid.
                            Tugas ini tidak dimasukkan dalam filter periode
                            berbasis tanggal. Pada Semua Waktu, tugas tersebut
                            tetap ditampilkan sebagai riwayat dengan waktu
                            yang belum tercatat.
                        </p>
                    </div>
                </div>
            )}


            {/* Riwayat */}
            <section className="mt-6 rounded-2xl bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                        <History size={22} className="text-primary" />
                    </div>

                    <div>
                        <h2 className="text-lg font-bold text-gray-800">
                            Riwayat Penyelesaian
                        </h2>

                        <p className="mt-1 text-sm text-textMuted">
                            Menampilkan tugas yang selesai pada periode{" "}
                            {selectedPeriodLabel.toLowerCase()}.
                        </p>
                    </div>
                </div>

                {recentCompletions.length === 0 ? (
                    <div className="mt-6 rounded-xl border border-dashed border-gray-200 px-4 py-10 text-center">
                        <ListTodo
                            size={36}
                            className="mx-auto text-gray-400"
                        />

                        <h3 className="mt-3 font-semibold text-gray-700">
                            Belum ada riwayat tugas
                        </h3>

                        <p className="mt-1 text-sm text-textMuted">
                            Tugas yang sudah diselesaikan akan muncul di sini.
                        </p>

                        <Link
                            to="/tasks"
                            className="mt-4 inline-flex rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                        >
                            Lihat Daftar Tugas
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Daftar tugas: maksimal 5 per halaman */}
                        <div className="mt-6 space-y-3">
                            {paginatedTasks.map((task) => {
                                const info = task.completionInfo;

                                const statusConfig = {
                                    "on-time": {
                                        label: "Tepat Waktu",
                                        style: "bg-green-50 text-green-700",
                                    },
                                    late: {
                                        label: "Terlambat",
                                        style: "bg-amber-50 text-amber-700",
                                    },
                                    unrecorded: {
                                        label: "Waktu Belum Lengkap",
                                        style: "bg-gray-100 text-gray-600",
                                    },
                                };

                                const status =
                                    statusConfig[info.status] ??
                                    statusConfig.unrecorded;

                                return (
                                    <article
                                        key={task.id}
                                        className="rounded-xl border border-gray-100 p-4 transition hover:border-gray-200"
                                    >
                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                            <div className="min-w-0">
                                                <h3 className="break-words font-semibold text-gray-800">
                                                    {task.title || task.name || "Tugas tanpa judul"}
                                                </h3>

                                                {task.course && (
                                                    <p className="mt-1 text-sm text-textMuted">
                                                        {task.course}
                                                    </p>
                                                )}

                                                {task.priority && (
                                                    <p className="mt-1 text-xs text-textMuted">
                                                        Prioritas: {task.priority}
                                                    </p>
                                                )}
                                            </div>

                                            <span
                                                className={`self-start whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ${status.style}`}
                                            >
                                                {status.label}
                                            </span>
                                        </div>

                                        <div className="mt-4 grid gap-3 border-t border-gray-100 pt-3 text-sm sm:grid-cols-2">
                                            <div className="flex items-start gap-2 text-textMuted">
                                                <CalendarClock
                                                    size={17}
                                                    className="mt-0.5 shrink-0"
                                                />

                                                <div>
                                                    <p className="font-medium text-gray-700">
                                                        Deadline
                                                    </p>

                                                    <p className="mt-1">
                                                        {info.deadlineAt
                                                            ? formatDateTime(info.deadlineAt)
                                                            : "Belum tersedia"}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-2 text-textMuted">
                                                <CheckCircle2
                                                    size={17}
                                                    className="mt-0.5 shrink-0"
                                                />

                                                <div>
                                                    <p className="font-medium text-gray-700">
                                                        Waktu Diselesaikan
                                                    </p>

                                                    <p className="mt-1">
                                                        {formatDateTime(info.completedAt)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-6 flex flex-col gap-4 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-sm text-slate-500">
                                    Menampilkan {firstItem}–{lastItem} dari{" "}
                                    {recentCompletions.length} tugas
                                </p>

                                <div className="flex flex-wrap items-center justify-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setCurrentPage(
                                                Math.max(1, safeCurrentPage - 1)
                                            )
                                        }
                                        disabled={safeCurrentPage === 1}
                                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        Sebelumnya
                                    </button>

                                    {Array.from(
                                        { length: totalPages },
                                        (_, index) => index + 1
                                    ).map((page) => (
                                        <button
                                            key={page}
                                            type="button"
                                            onClick={() => setCurrentPage(page)}
                                            aria-current={
                                                safeCurrentPage === page
                                                    ? "page"
                                                    : undefined
                                            }
                                            className={`min-w-9 rounded-lg px-3 py-2 text-sm font-medium transition ${safeCurrentPage === page
                                                    ? "bg-blue-500 text-white"
                                                    : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setCurrentPage(
                                                Math.min(
                                                    totalPages,
                                                    safeCurrentPage + 1
                                                )
                                            )
                                        }
                                        disabled={safeCurrentPage === totalPages}
                                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        Berikutnya
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </section>


            {/* Penjelasan perhitungan */}
            <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5">
                <h2 className="font-bold text-gray-800">
                    Cara membaca laporan
                </h2>

                <p className="mt-2 text-sm leading-6 text-textMuted">
                    Tugas selesai dihitung berdasarkan waktu penyelesaian
                    pada periode yang dipilih. Ketepatan waktu dihitung dari
                    tugas yang memiliki waktu penyelesaian dan deadline valid.
                    Tugas tanpa catatan waktu tidak dimasukkan dalam
                    persentase ketepatan waktu. Seluruh laporan menggunakan
                    tugas yang masih tersimpan di Taskly.
                </p>
            </div>
        </div>
    );
}

export default Reports;
