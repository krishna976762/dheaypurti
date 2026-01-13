import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function TeacherStudents({ token, teacher, batches }) {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(""); // "" | batchId | "my"
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/students", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const normalized = res.data.students.map((s) => ({
        ...s,
        batch: s.batch
          ? Array.isArray(s.batch)
            ? s.batch.map((b) => b._id)
            : [s.batch._id]
          : [],
      }));

      setStudents(normalized);
      setFilteredStudents(normalized);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    let filtered = [...students];

    if (selectedBatch === "my") {
      const teacherBatchIds = batches.map((b) => b._id);
      filtered = filtered.filter((s) =>
        Array.isArray(s.batch)
          ? s.batch.some((bId) => teacherBatchIds.includes(bId))
          : false
      );
    } else if (selectedBatch) {
      filtered = filtered.filter((s) =>
        Array.isArray(s.batch) ? s.batch.includes(selectedBatch) : false
      );
    }

    setFilteredStudents(filtered);
  }, [students, selectedBatch, batches]);
  console.log(filteredStudents, "filteredStudents");
  return (
    <div className="bg-white p-6 rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Students</h2>
        <div className="flex space-x-2">
          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">All Students</option>
            <option value="my">My Students</option>
            {batches.map((b) => (
              <option key={b._id} value={b._id}>
                {b.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredStudents.length > 0 ? (
        <table className="table-auto border-collapse border w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Batch(es)</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((s) => (
              <tr key={s._id}>
                <td className="border p-2">{s.fullName || s.name}</td>
                <td className="border p-2">{s.email || "N/A"}</td>
                <td className="border p-2">
                  {/* Show all batch titles */}
                  {s.batch
                    .map(
                      (bId) =>
                        batches.find((b) => b._id === bId)?.title || "N/A"
                    )
                    .filter(Boolean)
                    .join(", ")}
                </td>
                <td className="border p-2 space-x-2">
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    onClick={() =>
                      navigate(`/teacherDashboard/students/${s._id}`)
                    }
                  >
                    View
                  </button>
                  {/* Removed Edit button */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No students found.</p>
      )}
    </div>
  );
}
