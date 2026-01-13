import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/Modal";
import BatchForm from "./BatchForm";

export default function BatchList() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const [batches, setBatches] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchBatches();
    fetchTeachers();
  }, []);

  const fetchBatches = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/batches", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBatches(res.data.batches);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error fetching batches");
      console.error(err);
    }
  };

  const fetchTeachers = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/teachers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeachers(res.data.teachers);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (batch) => {
    setSelectedBatch(batch);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/batches/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBatches();
      toast.success("✅ Batch deleted successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error deleting batch");
    }
  };
console.log(batches,"batches")
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Batches</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => {
            setSelectedBatch(null);
            setShowForm(true);
          }}
        >
          Add Batch
        </button>
      </div>

      <div className="grid gap-4">
        {batches.map((b) => (
          <div
            key={b._id}
            className="bg-white shadow rounded-lg p-6 flex flex-col md:flex-row justify-between items-start md:items-center"
          >
            {/* Batch Info */}
            <div className="flex-1 w-full">
              <h2 className="text-xl font-bold mb-2">{b.title}</h2>
              <p className="text-gray-600 mb-1">
                <span className="font-medium">Timing:</span> {b.timing}
              </p>
              <p className="text-gray-600 mb-1">
                <span className="font-medium">Start:</span>{" "}
                {new Date(b.startDate).toLocaleDateString("en-IN")} |{" "}
                <span className="font-medium">End:</span>{" "}
                {new Date(b.endDate).toLocaleDateString("en-IN")}
              </p>

              {/* Subjects Table */}
              {b.subjects.length > 0 ? (
                <div className="mt-2">
                  <p className="font-medium text-gray-700 mb-1">Subjects:</p>
                  <ul className="border border-gray-200 rounded">
                    {b.subjects.map((s) => (
                      <li
                        key={s._id}
                        className="flex justify-between px-3 py-1 border-b last:border-b-0"
                      >
                        <span>{s.name}</span>
                        <span className="text-gray-500">
                          {s.teacherName || "N/A"}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-gray-500 mt-2">No subjects assigned</p>
              )}
            </div>

            {/* Action Buttons */}
            {role === "owner" && (
              <div className="mt-4 md:mt-0 md:ml-6 flex space-x-2">
                <button
                  onClick={() => navigate(`/dashboard/batches/view/${b._id}`)}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                  View
                </button>
                <button
                  onClick={() => handleEdit(b)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(b._id)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <Modal isOpen={showForm} onClose={() => setShowForm(false)}>
        <BatchForm
          batch={selectedBatch}
          teachers={teachers}
          onSuccess={() => {
            fetchBatches();
            setShowForm(false);
          }}
        />
      </Modal>
    </div>
  );
}
