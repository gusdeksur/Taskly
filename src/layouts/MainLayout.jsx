
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function MainLayout() {
    return (
        <div className="min-h-screen bg-background lg:flex">
            {/* Navigasi utama */}
            <Sidebar />

            {/* Area konten halaman */}
            <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
                <div className="mx-auto max-w-7xl">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

export default MainLayout;
