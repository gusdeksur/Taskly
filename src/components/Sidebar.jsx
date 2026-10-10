
import {
    CheckCircle2,
    ClipboardList,
    LayoutDashboard,
    ChartNoAxesCombined,
} from "lucide-react";
import { NavLink } from "react-router-dom";

import logo from "../assets/icon.png";

function Sidebar() {
    const navItems = [
        {
            label: "Dashboard",
            to: "/",
            icon: LayoutDashboard,
        },
        {
            label: "Daftar Tugas",
            to: "/tasks",
            icon: ClipboardList,
        },
        {
            label: "Laporan Produktivitas",
            to: "/reports",
            icon: ChartNoAxesCombined,
        },
    ];

    return (
        <aside className="w-full shrink-0 border-b border-gray-200 bg-white lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r">
            {/* Logo dan nama aplikasi */}
            <div className="flex items-center gap-3 px-5 py-4 lg:px-6 lg:py-7">
                <img
                    src={logo}
                    alt="Logo Taskly"
                    className="h-10 w-10 rounded-xl object-cover"
                />

                <span className="text-xl font-extrabold text-gray-800">
                    Taskly
                </span>
            </div>

            {/* Navigasi halaman */}
            <nav
                aria-label="Navigasi utama"
                className="flex gap-2 overflow-x-auto px-4 pb-4 lg:flex-col lg:px-4 lg:pb-0"
            >
                {navItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.to === "/"}
                            className={({ isActive }) =>
                                `flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${isActive
                                    ? "bg-primary text-white shadow-sm"
                                    : "text-textMuted hover:bg-background hover:text-gray-800"
                                }`
                            }
                        >
                            <Icon size={19} />
                            <span>{item.label}</span>
                        </NavLink>
                    );
                })}
            </nav>

            {/* Informasi tambahan di desktop */}
            <div className="hidden px-5 pb-6 pt-8 lg:block">
                <div className="rounded-2xl bg-background p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                        <CheckCircle2
                            size={21}
                            className="text-primary"
                        />
                    </div>

                    <p className="mt-3 font-bold text-gray-800">
                        Satu tugas setiap langkah
                    </p>

                    <p className="mt-2 text-sm leading-6 text-textMuted">
                        Catat tugasmu, atur prioritas, dan pantau progresnya
                        dengan Taskly.
                    </p>
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;
