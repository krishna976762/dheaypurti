import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/Modal";
import StudentForm from "./StudentForm";

export default function StudentList() {
  const token = localStorage.getItem("token");
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/students", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(res.data.students);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setShowForm(true);
  };

  const handleView = (student) => {
    navigate(`/dashboard/students/${student._id}`);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Students</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => { setSelectedStudent(null); setShowForm(true); }}
        >
          Add Student
        </button>
      </div>

      <div className="space-y-4">
        {students.map((s) => (
          <div
            key={s._id}
            className="bg-white p-4 rounded shadow flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{s.fullName}</p>
              <p className="text-gray-500 text-sm">Batch: {s.batch?.title || "N/A"}</p>
              <p className="text-gray-500 text-sm">Mobile: {s.studentContact}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleView(s)}
                className="text-green-600 hover:text-green-800 font-medium"
              >
                View
              </button>
              <button
                onClick={() => handleEdit(s)}
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <Modal isOpen={showForm} onClose={() => setShowForm(false)}>
          <StudentForm
            student={selectedStudent}
            onSuccess={() => { fetchStudents(); setShowForm(false); }}
          />
        </Modal>
      )}
    </div>
  );
}
