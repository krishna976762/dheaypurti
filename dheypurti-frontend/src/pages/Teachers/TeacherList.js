import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "../../components/Modal";
import TeacherForm from "./TeacherForm";

import { useNavigate } from "react-router-dom";

export default function TeacherList() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    const res = await axios.get("http://localhost:4000/api/teachers", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTeachers(res.data.teachers);
  };

  const handleEdit = (teacher) => {
    setSelectedTeacher(teacher);
    setShowForm(true);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Teachers</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => { setSelectedTeacher(null); setShowForm(true); }}
        >
          Add Teacher
        </button>
      </div>

      <div className="space-y-4">
        {teachers.map((t) => (
          <div
            key={t._id}
            className="bg-white p-4 rounded shadow flex justify-between items-center"
          >
            <div className="flex items-center space-x-4">
              <img
                src={`http://localhost:4000${t.photo}`}
                alt={t.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold">{t.name}</p>
                <p className="text-gray-500 text-sm">{t.email}</p>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => navigate(`/dashboard/teachers/${t._id}`)}
                className="text-green-600 hover:text-green-800 font-medium"
              >
                View
              </button>
              <button
                onClick={() => handleEdit(t)}
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={showForm} onClose={() => setShowForm(false)}>
        <TeacherForm
          teacher={selectedTeacher}
          onSuccess={() => {
            fetchTeachers();
            setShowForm(false);
          }}
        />
      </Modal>
    </div>
  );
}

