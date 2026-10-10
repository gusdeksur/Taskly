
import {
    HashRouter,
    Routes,
    Route,
    Link,
} from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Reports from "./pages/Reports";

function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
            <h1 className="text-4xl font-extrabold text-gray-800">
                404
            </h1>

            <p className="mt-3 text-lg font-semibold text-gray-700">
                Halaman tidak ditemukan
            </p>

            <p className="mt-2 text-sm text-textMuted">
                Halaman yang kamu cari tidak tersedia.
            </p>

            <Link
                to="/"
                className="mt-5 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
                Kembali ke Dashboard
            </Link>
        </div>
    );
}

function App() {
    return (
        <HashRouter>
            <Routes>
                {/* Layout utama untuk halaman aplikasi */}
                <Route element={<MainLayout />}>
                    <Route
                        path="/"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/tasks"
                        element={<Tasks />}
                    />

                    <Route
                        path="/reports"
                        element={<Reports />}
                    />
                </Route>

                {/* Halaman untuk URL yang tidak dikenal */}
                <Route
                    path="*"
                    element={<NotFound />}
                />
            </Routes>
        </HashRouter>
    );
}

export default App;
