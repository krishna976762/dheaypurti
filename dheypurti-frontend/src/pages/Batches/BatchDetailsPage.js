import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function BatchDetailsPage() {
  const { id } = useParams();
  const token = localStorage.getItem("token");

  const [batch, setBatch] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchBatch();
  }, []);

  const fetchBatch = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/api/batches/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBatch(res.data.batch);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error fetching batch");
      console.error(err);
    }
  };

  if (!batch) return <p className="p-4">Loading batch details...</p>;

  const filteredStudents = (batch.students || []).filter((s) => {
  const status = s.fees?.feePaid ? "Paid" : "Remaining"; // derive status
  if (filter === "paid") return status === "Paid";
  if (filter === "remaining") return status === "Remaining";
  return true;
});


  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">{batch.title}</h1>
      <p className="text-gray-700 mb-2">
        <strong>Timing:</strong> {batch.timing}
      </p>
      <p className="text-gray-700 mb-4">
        <strong>Start:</strong> {new Date(batch.startDate).toLocaleDateString("en-IN")} |{" "}
        <strong>End:</strong> {new Date(batch.endDate).toLocaleDateString("en-IN")}
      </p>

      <h2 className="text-xl font-semibold mb-2">Teachers</h2>
      {batch.subjects.length > 0 ? (
        <ul className="mb-4">
          {batch.subjects.map((s) => (
            <li key={s._id}>
              {s.name} — {s.teacherName || "N/A"}
            </li>
          ))}
        </ul>
      ) : (
        <p>No teachers assigned</p>
      )}

      <h2 className="text-xl font-semibold mb-2">Students</h2>

      <div className="flex gap-2 mb-3">
        {["all", "paid", "remaining"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded ${
              filter === f ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            {f === "all" ? "All" : f === "paid" ? "Fees Paid" : "Fees Remaining"}
          </button>
        ))}
      </div>

      {filteredStudents.length > 0 ? (
        <ul className="border border-gray-200 rounded">
          {filteredStudents.map((st) => (
            <li
              key={st._id}
              className="flex justify-between px-3 py-2 border-b last:border-b-0"
            >
              <span>{st.fullName}</span>
              <span className={st.feesStatus === "Paid" ? "text-green-600" : "text-red-600"}>
                {st.feesStatus}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No students found</p>
      )}
    </div>
  );
}
