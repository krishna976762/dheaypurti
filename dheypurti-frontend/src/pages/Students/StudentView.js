import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import StudentForm from "./StudentForm";

export default function StudentView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [student, setStudent] = useState(null);

  useEffect(() => {
    fetchStudent();
  }, []);

  const fetchStudent = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/api/students/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudent(res.data.student);
    } catch (err) {
      console.error(err);
    }
  };

  if (!student) return <p>Loading...</p>;

  return (
    <div className="p-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
      >
        Back
      </button>
      <h1 className="text-2xl font-bold mb-4">View Student</h1>
      <StudentForm student={student} readOnly />
    </div>
  );
}
