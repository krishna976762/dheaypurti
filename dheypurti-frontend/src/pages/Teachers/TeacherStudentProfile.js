// src/pages/Teachers/TeacherStudentProfile.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function TeacherStudentProfile() {
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudent();
  }, []);

  const fetchStudent = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/api/students/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // exclude fee info
      const { fees, ...limitedStudent } = res.data.student;
      setStudent(limitedStudent);
    } catch (err) {
      console.error("Error fetching student:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="p-8">Loading student...</p>;
  if (!student) return <p className="p-8">Student not found.</p>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
      >
        ← Back
      </button>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">{student.fullName}</h2>

        <div className="grid grid-cols-2 gap-4">
          {/* Basic Info */}
          <div>
            <p className="font-semibold">Email:</p>
            <p>{student.email || "N/A"}</p>
          </div>
          <div>
            <p className="font-semibold">Mobile:</p>
            <p>{student.studentContact || "N/A"}</p>
          </div>
          <div>
            <p className="font-semibold">Gender:</p>
            <p>{student.gender || "N/A"}</p>
          </div>
          <div>
            <p className="font-semibold">Date of Birth:</p>
            <p>
              {student.dob
                ? new Date(student.dob).toLocaleDateString("en-IN")
                : "N/A"}
            </p>
          </div>
          <div>
            <p className="font-semibold">Address:</p>
            <p>{student.address || "N/A"}</p>
          </div>
          <div>
            <p className="font-semibold">School / College:</p>
            <p>{student.schoolName || "N/A"}</p>
          </div>
          <div>
            <p className="font-semibold">Current Class:</p>
            <p>{student.currentClass || "N/A"}</p>
          </div>
          <div>
            <p className="font-semibold">Stream:</p>
            <p>{student.stream || "N/A"}</p>
          </div>

          {/* Academic Info */}
          <div>
            <p className="font-semibold">Mode of Class:</p>
            <p>{student.modeOfClass || "N/A"}</p>
          </div>
          <div>
            <p className="font-semibold">Preferred Timing:</p>
            <p>{student.preferredTiming || "N/A"}</p>
          </div>

          {/* Batch Info */}
          <div className="col-span-2">
            <p className="font-semibold">Batch:</p>
            <p>
              {student.batch
                ? `${student.batch.title} (${new Date(
                    student.batch.startDate
                  ).toLocaleDateString("en-IN")} - ${new Date(
                    student.batch.endDate
                  ).toLocaleDateString("en-IN")})`
                : "N/A"}
            </p>
          </div>

          {/* Subjects */}
          <div className="col-span-2">
            <p className="font-semibold">Subjects:</p>
            <p>
              {Array.isArray(student.subjects) && student.subjects.length > 0
                ? student.subjects.join(", ")
                : "N/A"}
            </p>
          </div>

          {/* Guardian Info */}
          <div>
            <p className="font-semibold">Guardian Name:</p>
            <p>{student.guardianName || "N/A"}</p>
          </div>
          <div>
            <p className="font-semibold">Guardian Contact:</p>
            <p>{student.guardianContact || "N/A"}</p>
          </div>
          <div>
            <p className="font-semibold">Guardian Email:</p>
            <p>{student.guardianEmail || "N/A"}</p>
          </div>
          <div>
            <p className="font-semibold">Relationship:</p>
            <p>{student.relationship || "N/A"}</p>
          </div>
          <div>
            <p className="font-semibold">Occupation:</p>
            <p>{student.occupation || "N/A"}</p>
          </div>

          {/* Emergency Info */}
          <div>
            <p className="font-semibold">Emergency Contact Name:</p>
            <p>{student.emergencyContactName || "N/A"}</p>
          </div>
          <div>
            <p className="font-semibold">Emergency Contact Number:</p>
            <p>{student.emergencyContactNumber || "N/A"}</p>
          </div>

          <div>
            <p className="font-semibold">Medical Conditions:</p>
            <p>{student.medicalConditions || "N/A"}</p>
          </div>

          <div className="col-span-2">
            <p className="font-semibold">Enrollment Date:</p>
            <p>
              {student.enrollmentDate
                ? new Date(student.enrollmentDate).toLocaleDateString("en-IN")
                : "N/A"}
            </p>
          </div>

          <div className="col-span-2">
            <p className="font-semibold">Status:</p>
            <p>{student.isActive ? "Active" : "Inactive"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
