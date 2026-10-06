import { useState } from "react";
import {
  CheckCircle2,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import Navbar from "./components/Navbar";
import TaskCard from "./components/TaskCard";
import TaskForm from "./components/TaskForm";
import TaskStats from "./components/TaskStats";
import { useTask } from "./context/TaskContext";

function App() {
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

  return (
    <>
      <Navbar
        nama="Surya"
        onAddTask={() => {
          setEditingTask(null);
          setShowForm(true);
        }}
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <h2 className="text-2xl font-bold text-textMuted sm:text-3xl">
          Dashboard
        </h2>

        <div className="mt-6">
          <TaskStats />
        </div>



        <div className="mt-6 flex flex-wrap gap-2">
          {["Semua", "Belum Selesai", "Selesai"].map((item) => (
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

        <div className="mt-6">
          {tasks.length === 0 ? (
            <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
              <p className="font-semibold text-textMuted">
                Belum ada tugas
              </p>

              <p className="mt-1 text-sm text-textMuted">
                Tambahkan tugas pertamamu melalui tombol di atas.
              </p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
              <p className="font-semibold text-textMuted">
                Tidak ada tugas
              </p>

              <p className="mt-1 text-sm text-textMuted">
                Tidak ada tugas dengan status "{filter}".
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  id={task.id}
                  title={task.title}
                  course={task.course}
                  deadline={task.deadline}
                  priority={task.priority}
                  completed={task.completed}
                  onDeleteSuccess={handleTaskDeleted}
                  onEdit={() => handleEdit(task)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal tambah / edit tugas */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 px-4 py-8"
          onClick={() => {
            setShowForm(false);
            setEditingTask(null);
          }}
        >
          <div
            className="relative w-full max-w-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                setShowForm(false);
                setEditingTask(null);
              }}
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

export default App;