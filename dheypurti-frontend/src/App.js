import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";

// Pages
import Login from "./pages/Login";
import HomePage from "./pages/HomePage";
import Layout from "./components/Layout";

// Dashboards
import OwnerDashboard from "./pages/OwnerDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";

// Teachers
import TeacherList from "./pages/Teachers/TeacherList";
import TeacherForm from "./pages/Teachers/TeacherForm";
import TeacherDetailsPage from "./pages/Teachers/TeacherDetails";
import TeacherBatchView from "./pages/Teachers/TeacherBatchView";
import TeacherStudentProfile  from "./pages/Teachers/TeacherStudentProfile";

// Students
import StudentList from "./pages/Students/StudentList";
import StudentForm from "./pages/Students/StudentForm";
import StudentView from "./pages/Students/StudentView";

// Batches
import BatchList from "./pages/Batches/BatchList";
import BatchForm from "./pages/Batches/BatchForm";
import BatchDetailsPage from "./pages/Batches/BatchDetailsPage";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userRole, setUserRole] = useState(localStorage.getItem("role"));
  const updateAuth = (newToken, newRole) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("role", newRole);
    setToken(newToken);
    setUserRole(newRole);
  };


  // ✅ Role-based routing logic
  const getDashboardPath = () => {
    if (!token) return "/login";
    if (userRole === "teacher") return "/teacherDashboard";
    if (userRole === "owner") return "/dashboard";
    return "/login";
  };

  // ✅ Secure route wrapper
  const PrivateRoute = ({ children, roles }) => {
    if (!token) return <Navigate to="/login" replace />;
    if (roles && !roles.includes(userRole)) return <Navigate to="/" replace />;
    return children;
  };

  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        {/* Root Route - direct role-based redirect */}
        <Route path="/" element={<Navigate to={getDashboardPath()} replace />} />

        {/* Public Routes */}
        <Route path="/login" element={<Login updateAuth={updateAuth} />} />
        <Route path="/home" element={<HomePage />} />

        {/* Owner Dashboard + Layout */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute roles={["owner"]}>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<OwnerDashboard />} />
          <Route path="teachers" element={<TeacherList />} />
          <Route path="teachers/add" element={<TeacherForm />} />
          <Route path="teachers/edit/:id" element={<TeacherForm />} />
          <Route path="teachers/:id" element={<TeacherDetailsPage />} />
          <Route path="students" element={<StudentList />} />
          <Route path="students/add" element={<StudentForm />} />
          <Route path="students/edit/:id" element={<StudentForm />} />
          <Route path="students/:id" element={<StudentView />} />
          <Route path="batches" element={<BatchList />} />
          <Route path="batches/add" element={<BatchForm />} />
          <Route path="batches/edit/:id" element={<BatchForm />} />
          <Route path="batches/view/:id" element={<BatchDetailsPage />} />
        </Route>

        {/* Teacher Dashboard */}
        <Route
          path="/teacherDashboard"
          element={
            <PrivateRoute roles={["teacher"]}>
              <TeacherDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/teacherDashboard/batch/:id"
          element={
            <PrivateRoute roles={["teacher"]}>
              <TeacherBatchView />
            </PrivateRoute>
          }
        />

        <Route
          path="/teacherDashboard/students/:id"
          element={
            <PrivateRoute roles={["teacher"]}>
              <TeacherStudentProfile  />
            </PrivateRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
