import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import TeacherDetailsCard from "./TeacherDetailsCard";

export default function TeacherDetailsPage() {
  const { id } = useParams();
  const token = localStorage.getItem("token");

  const [teacher, setTeacher] = useState(null);
  const [batches, setBatches] = useState([]);
  const [loadingTeacher, setLoadingTeacher] = useState(true);
  const [loadingBatches, setLoadingBatches] = useState(true);

  // Fetch teacher details
  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/teachers/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTeacher(res.data.teacher);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingTeacher(false);
      }
    };
    fetchTeacher();
  }, [id, token]);

  // Fetch all batches and filter for this teacher
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/batches", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Filter batches where this teacher is included
        const teacherBatches = res.data.batches.filter(batch =>
          batch.teachers.some(t => t._id === id)
        );

        setBatches(teacherBatches);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingBatches(false);
      }
    };
    fetchBatches();
  }, [id, token]);

  if (loadingTeacher) return <p>Loading teacher details...</p>;

  return (
    <div className="p-6 space-y-6">
      {teacher ? <TeacherDetailsCard teacher={teacher} /> : <p>No teacher data available.</p>}

      {/* Batch Section */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-semibold mb-4">Batches Associated</h2>
        {loadingBatches ? (
          <p>Loading batches...</p>
        ) : batches.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Title</th>
                <th className="border p-2 text-left">Start Date</th>
                <th className="border p-2 text-left">End Date</th>
                <th className="border p-2 text-left">Timing</th>
              </tr>
            </thead>
            <tbody>
              {batches.map((b) => (
                <tr key={b._id}>
                  <td className="border p-2">{b.title}</td>
                  <td className="border p-2">{new Date(b.startDate).toLocaleDateString("en-IN")}</td>
                  <td className="border p-2">{new Date(b.endDate).toLocaleDateString("en-IN")}</td>
                  <td className="border p-2">{b.timing}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No batches assigned to this teacher.</p>
        )}
      </div>
    </div>
  );
}
