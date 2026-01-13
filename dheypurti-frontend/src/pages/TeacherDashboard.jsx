import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import TeacherStudents from "./TeacherStudents";
import TeacherProfile from "./Teachers/TeacherProfile";


export default function TeacherDashboard() {
  const token = localStorage.getItem("token");
  const teacherId = localStorage.getItem("teacherId");
  console.log(token,"token")
  const navigate = useNavigate();

  const [teacher, setTeacher] = useState(null);
  const [allBatches, setAllBatches] = useState([]);
  const [batches, setBatches] = useState([]);
  const [students, setStudents] = useState([]);
  const [activeTab, setActiveTab] = useState("batches"); // batches | students | profile
  const [showMyBatches, setShowMyBatches] = useState(false);

  useEffect(() => {
    fetchBatches(); // Fetch batches on login
  }, []);

  const fetchBatches = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/batches", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAllBatches(res.data.batches);

      // Filter batches assigned to this teacher
      const teacherBatches = res.data.batches.filter((b) =>
        b?.teachers?.some((t) => t._id === teacherId)
      );
      setBatches(teacherBatches);
    } catch (err) {
      console.error(err);
    }
  };
console.log("Token used for students API:", token);
  const fetchStudents = async () => {
    
    try {
      const res = await axios.get(`http://localhost:4000/api/students`, {
         headers: { Authorization: `Bearer ${token.trim()}` },
      });

      // Limit student info (exclude sensitive fields like fees)
      const limited = res.data.students.map((s) => ({
        _id: s._id,
        name: s.name,
        email: s.email,
        batch: Array.isArray(s.batch) ? s.batch.filter(Boolean) : s.batch ? [s.batch] : [],
      }));

      setStudents(limited);
    } catch (err) {
      console.error("Cannot fetch students:", err);
      setStudents([]); // fallback empty list
    }
  };

  const fetchTeacherProfile = async () => {
    try {
      const res = await axios.get(
        `http://localhost:4000/api/teachers/${teacherId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTeacher(res.data);
    } catch (err) {
      console.error("Failed to fetch teacher profile:", err);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);

    if (tab === "students" && students.length === 0) {
      fetchStudents();
    }

    if (tab === "profile" && !teacher) {
      fetchTeacherProfile();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("teacherId");
    localStorage.removeItem("role");
    toast.success("Logout successful!", {
        position: "top-right",
        autoClose: 2000,
      });
    window.location.href = "/login";
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col p-6">
        <h2 className="text-xl font-bold mb-6">Dashboard</h2>

        <button
          onClick={() => handleTabClick("batches")}
          className={`mb-2 w-full text-left p-2 rounded ${
            activeTab === "batches"
              ? "bg-blue-500 text-white"
              : "hover:bg-gray-100"
          }`}
        >
          Batches
        </button>

        <button
          onClick={() => handleTabClick("students")}
          className={`mb-2 w-full text-left p-2 rounded ${
            activeTab === "students"
              ? "bg-blue-500 text-white"
              : "hover:bg-gray-100"
          }`}
        >
          Students
        </button>

        <button
          onClick={() => handleTabClick("profile")}
          className={`mb-2 w-full text-left p-2 rounded ${
            activeTab === "profile"
              ? "bg-blue-500 text-white"
              : "hover:bg-gray-100"
          }`}
        >
          Profile
        </button>

        <button
          onClick={handleLogout}
          className="mt-auto bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        {/* Batches Tab */}
        {activeTab === "batches" && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Batches</h2>

            <div className="mb-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showMyBatches}
                  onChange={(e) => setShowMyBatches(e.target.checked)}
                />
                <span>Show only my batches</span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(showMyBatches ? batches : allBatches).length > 0 ? (
                (showMyBatches ? batches : allBatches).map((b) => (
                  <div
                    key={b._id}
                    className="bg-white p-4 rounded shadow cursor-pointer hover:shadow-lg transition"
                    onClick={() => navigate(`/teacherDashboard/batch/${b._id}`)}
                  >
                    <h3 className="text-xl font-semibold">{b.title}</h3>
                    <p>
                      <strong>Start:</strong>{" "}
                      {new Date(b.startDate).toLocaleDateString("en-IN")}
                    </p>
                    <p>
                      <strong>End:</strong>{" "}
                      {new Date(b.endDate).toLocaleDateString("en-IN")}
                    </p>
                    <p>
                      <strong>Timing:</strong> {b.timing}
                    </p>
                  </div>
                ))
              ) : (
                <p>No batches found.</p>
              )}
            </div>
          </section>
        )}

        {/* Students Tab */}
        {activeTab === "students" && (
          <TeacherStudents
            students={students}
            teacherId={teacherId}
            batches={batches}
            token={token}
          />
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && teacher && <TeacherProfile teacher={teacher?.teacher} />}

      </div>
    </div>
  );
}
