import React from "react";
import { NavLink, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();
  const links = [
    { name: "Dashboard", path: "/" },
    { name: "Teachers", path: "/dashboard/teachers" },
    { name: "Students", path: "/dashboard/students" },
    { name: "Batches", path: "/dashboard/batches" },
  ];

  const isLinkActive = (linkPath) => {
    if (linkPath === "/") return location.pathname === "/";
    return location.pathname.startsWith(linkPath);
  };

  return (
    <div className="w-64 bg-gray-800 text-white h-screen p-6">
      <h1 className="text-2xl font-bold mb-6">Owner Panel</h1>
      <nav className="space-y-3">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={() =>
              `block px-4 py-2 rounded hover:bg-gray-700 ${
                isLinkActive(link.path) ? "bg-gray-700" : ""
              }`
            }
          >
            {link.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
