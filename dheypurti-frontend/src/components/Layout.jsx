import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Layout() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("userData");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    if (storedUser) {
      try {
        setUserData(JSON.parse(storedUser));
      } catch (err) {
        console.error("Failed to parse userData:", err);
        localStorage.removeItem("userData");
        navigate("/login", { replace: true });
      }
    } else {
      // only redirect if not already on login
      if (window.location.pathname !== "/login") {
        navigate("/login", { replace: true });
      }
    }
    // run once
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    toast.success("Logout successful!", {
        position: "top-right",
        autoClose: 2000,
      });
    navigate("/login", { replace: true });
  };

  if (!userData) return null; // prevent flicker while loading user

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6 flex flex-col">
        <h2 className="text-xl font-bold mb-8">
          {userData.user?.name || userData.name || "Dashboard"}
        </h2>

        <nav className="flex flex-col space-y-3">
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              `px-3 py-2 rounded hover:bg-gray-200 ${
                isActive ? "bg-gray-200 font-semibold" : ""
              }`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/dashboard/teachers"
            className={({ isActive }) =>
              `px-3 py-2 rounded hover:bg-gray-200 ${
                isActive ? "bg-gray-200 font-semibold" : ""
              }`
            }
          >
            Teachers
          </NavLink>
          <NavLink
            to="/dashboard/students"
            className={({ isActive }) =>
              `px-3 py-2 rounded hover:bg-gray-200 ${
                isActive ? "bg-gray-200 font-semibold" : ""
              }`
            }
          >
            Students
          </NavLink>
          <NavLink
            to="/dashboard/batches"
            className={({ isActive }) =>
              `px-3 py-2 rounded hover:bg-gray-200 ${
                isActive ? "bg-gray-200 font-semibold" : ""
              }`
            }
          >
            Batches
          </NavLink>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">
            Welcome, {userData.user?.name || userData.name || "User"}
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 transition"
          >
            Logout
          </button>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
