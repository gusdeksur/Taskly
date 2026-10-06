import { Plus } from "lucide-react";
import logo from "../assets/icon.png";

function Navbar({ nama, onAddTask }) {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="flex items-center justify-between px-5 py-4 sm:px-8">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="Logo Taskly"
            className="h-9 w-9 rounded-xl object-cover sm:h-10 sm:w-10"
          />

          <span className="text-xl font-extrabold text-primary">
            Taskly
          </span>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-4">
          <span className="hidden text-sm font-semibold text-textMuted sm:block">
            Halo, {nama}
          </span>

          <button
            onClick={onAddTask}
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">
              Tambah Tugas
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;