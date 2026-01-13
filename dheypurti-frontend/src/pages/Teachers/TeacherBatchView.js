import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function TeacherBatchView() {
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [batch, setBatch] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBatch();
  }, []);

  const fetchBatch = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/api/batches/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBatch(res.data.batch);

      // fetch all students associated with this batch
      const studentRes = await axios.get(`http://localhost:4000/api/students`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const batchStudents = studentRes.data.students.filter((s) => {
        const studentBatches = Array.isArray(s.batch)
          ? s.batch.map((b) => (b?._id ? b._id : b))
          : s.batch?._id
          ? [s.batch._id]
          : [];

        return studentBatches.includes(id);
      });

      setStudents(batchStudents);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="p-8">Loading batch details...</p>;
  if (!batch) return <p className="p-8">Batch not found.</p>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
      >
        ← Back
      </button>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">{batch.title}</h2>
        <p>
          <strong>Start Date:</strong>{" "}
          {new Date(batch.startDate).toLocaleDateString("en-IN")}
        </p>
        <p>
          <strong>End Date:</strong>{" "}
          {new Date(batch.endDate).toLocaleDateString("en-IN")}
        </p>
        <p>
          <strong>Timing:</strong> {batch.timing}
        </p>
        <p className="mt-2">
          <strong>Teachers:</strong>{" "}
          {batch.teachers && batch.teachers.length > 0
            ? batch.teachers.map((t) => t.name).join(", ")
            : "No teachers assigned"}
        </p>
      </div>

      <div className="mt-8 bg-white p-6 rounded shadow">
        <h3 className="text-xl font-semibold mb-4">Students in this Batch</h3>
        {students.length > 0 ? (
          <table className="w-full border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border-b">Name</th>
                <th className="p-2 border-b">Mobile No.</th>
                <th className="p-2 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s._id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{s.fullName}</td>
                  <td className="p-2">{s.studentContact}</td>
                  <td className="p-2">
                    <button
                      onClick={() =>
                        navigate(`/teacherDashboard/students/${s._id}`)
                      }
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No students found for this batch.</p>
        )}
      </div>
    </div>
  );
}
