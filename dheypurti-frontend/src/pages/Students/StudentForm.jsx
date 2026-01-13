import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function StudentForm({ student, onSuccess }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const [batches, setBatches] = useState([]);
  const [errors, setErrors] = useState({});
  const [newExam, setNewExam] = useState("");
  const [newPayment, setNewPayment] = useState({
    amount: "",
    date: "",
    receiptNumber: "",
  });

  const initialFormData = {
    fullName: "",
    dob: "",
    gender: "",
    address: "",
    studentContact: "",
    email: "",
    guardianName: "",
    relationship: "",
    occupation: "",
    guardianContact: "",
    guardianEmail: "",
    schoolName: "",
    currentClass: "",
    stream: "",
    batch: "",
    subjects: [],
    previousExams: [],
    preferredTiming: "",
    modeOfClass: "",
    fees: {
      total: 0,
      paymentMode: "", // Cash / UPI / Bank Transfer
      feePaid: false,
      paymentDate: "", // or new Date()
      receiptNumber: "",
      paymentHistory: [],
    },
    medicalConditions: "",
    emergencyContactName: "",
    emergencyContactNumber: "",
    isActive: true,
  };

  const [formData, setFormData] = useState(initialFormData);
const totalPaid = formData?.fees?.payments?.reduce(
  (sum, p) => sum + Number(p.amount || 0),
  0
);
const remaining = Math.max(formData.fees.total - totalPaid, 0); 
  // Fetch batches
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/batches", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBatches(res.data.batches || []);
      } catch (err) {
        toast.error("Failed to fetch batches");
      }
    };
    fetchBatches();
  }, [token]);

  // Pre-fill form when editing a student
  useEffect(() => {
    if (student) {
      setFormData({
        ...initialFormData,
        ...student,
        dob: student.dob ? student.dob.slice(0, 10) : "",
        batch: student.batch?._id || "",
        fees: {
          total: student.fees?.total || 0,
          payments: student.fees?.paymentHistory || [], // backend uses paymentHistory
          feePaid: student.fees?.feePaid || false,
        },
      });
    } else {
      setFormData(initialFormData);
    }
  }, [student]);

  // Validation helpers
  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const validatePhone = (phone) => /^\d{10}$/.test(phone);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "batch") {
      setFormData({ ...formData, batch: value, subjects: [] });
      return;
    }

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Toggle subject selection
  const handleSubjectToggle = (subjectId) => {
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects.includes(subjectId)
        ? prev.subjects.filter((id) => id !== subjectId)
        : [...prev.subjects, subjectId],
    }));
  };

  // Add previous exam
  const handleAddExam = () => {
    if (!newExam.trim()) return;
    setFormData({
      ...formData,
      previousExams: [...formData.previousExams, newExam.trim()],
    });
    setNewExam("");
  };

  // Fee calculations
  const calculatePaid = formData?.fees?.payments?.reduce(
    (sum, p) => sum + Number(p.amount || 0),
    0
  );

  // Add payment
  const handleAddPayment = () => {
    const { amount, date, receiptNumber, paymentMode } = newPayment;

    if (!amount || !date || !receiptNumber || !paymentMode) {
      alert("Please fill all payment details");
      return;
    }

    const updatedHistory = [
      ...formData.fees.paymentHistory,
      {
        amount: Number(amount),
        date,
        receiptNumber,
        paymentMode,
      },
    ];

    const totalPaid = formData?.fees?.paymentHistory?.reduce(
  (sum, p) => sum + Number(p.amount || 0),
  0
);
    const feePaidStatus = totalPaid >= formData.fees.total;

    setFormData({
      ...formData,
      fees: {
        ...formData.fees,
        paymentHistory: updatedHistory,
        feePaid: feePaidStatus,
      },
    });

    // Clear new payment inputs
    setNewPayment({ amount: "", date: "", receiptNumber: "", paymentMode: "" });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = true;
    if (!validateEmail(formData.email)) newErrors.email = true;
    if (!validatePhone(formData.studentContact))
      newErrors.studentContact = true;
    if (!formData.batch) newErrors.batch = true;

    setErrors(newErrors);
    if (Object.keys(newErrors).length) {
      toast.error("Please correct the highlighted fields");
      return;
    }

    try {
      if (student) {
        await axios.patch(
          `http://localhost:4000/api/students/${student._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Student updated successfully");
      } else {
        await axios.post("http://localhost:4000/api/students", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Student created successfully");
      }
      onSuccess();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save student");
    }
  };
console.log(formData,"formData")
  // Subjects depend on selected batch
  const SUBJECT_OPTIONS = formData.batch
  ? batches.find((b) => b._id === formData.batch)?.subjects || []
  : [];

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow border overflow-hidden"
    >
      <div className="max-h-[70vh] overflow-y-auto p-4 space-y-6">
        {/* Basic Info */}
        <section>
          <h2 className="font-semibold text-lg mb-2">🧾 Basic Information</h2>
          <div className="space-y-3">
            <div className="flex items-center">
              <label className="w-40 font-medium">Full Name:</label>
              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={`border rounded px-3 py-2 flex-1 ${
                  errors.fullName ? "border-red-500" : ""
                }`}
              />
            </div>

            <div className="flex items-center">
              <label className="w-40 font-medium">Date of Birth:</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="border rounded px-3 py-2 flex-1"
              />
            </div>

            <div className="flex items-center">
              <label className="w-40 font-medium">Gender:</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="border rounded px-3 py-2 flex-1"
              >
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            <div className="flex items-center">
              <label className="w-40 font-medium">Address:</label>
              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="border rounded px-3 py-2 flex-1"
              />
            </div>

            <div className="flex items-center">
              <label className="w-40 font-medium">Contact Number:</label>
              <input
                name="studentContact"
                value={formData.studentContact}
                onChange={handleChange}
                className={`border rounded px-3 py-2 flex-1 ${
                  errors.studentContact ? "border-red-500" : ""
                }`}
                placeholder="10-digit phone number"
              />
            </div>

            <div className="flex items-center">
              <label className="w-40 font-medium">Email:</label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`border rounded px-3 py-2 flex-1 ${
                  errors.email ? "border-red-500" : ""
                }`}
              />
            </div>

            <div className="flex items-center">
              <label className="w-40 font-medium">Batch:</label>
              <select
                name="batch"
                value={formData.batch}
                onChange={handleChange}
                className={`border rounded px-3 py-2 flex-1 ${
                  errors.batch ? "border-red-500" : ""
                }`}
              >
                <option value="">Select Batch</option>
                {batches.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Academic Info */}
        <section>
          <h2 className="font-semibold text-lg mb-2">
            🎓 Academic Information
          </h2>
          <div className="space-y-3">
            <div className="flex items-center">
              <label className="w-40 font-medium">School / College:</label>
              <input
                name="schoolName"
                value={formData.schoolName}
                onChange={handleChange}
                className="border rounded px-3 py-2 flex-1"
              />
            </div>

            <div className="flex items-center">
              <label className="w-40 font-medium">Class / Grade:</label>
              <input
                name="currentClass"
                value={formData.currentClass}
                onChange={handleChange}
                className="border rounded px-3 py-2 flex-1"
              />
            </div>

            <div className="flex items-center">
              <label className="w-40 font-medium">Stream:</label>
              <input
                name="stream"
                value={formData.stream}
                onChange={handleChange}
                className="border rounded px-3 py-2 flex-1"
              />
            </div>

            <div>
              <label className="font-medium block mb-1">
                Subjects Enrolled:
              </label>
              <div className="flex flex-wrap gap-3">
                {SUBJECT_OPTIONS.length === 0 ? (
                  <p className="text-sm text-gray-500 pl-40">
                    Select a batch to see subjects
                  </p>
                ) : (
                  SUBJECT_OPTIONS.map((s) => (
                    <label key={s._id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.subjects.includes(s._id)}
                        onChange={() => handleSubjectToggle(s._id)}
                      />
                      <span>{s.name}</span>
                    </label>
                  ))
                )}
              </div>
            </div>

            <div>
              <label className="font-medium block mb-1">Previous Exams:</label>
              <div className="flex gap-2 mb-2">
                <input
                  value={newExam}
                  onChange={(e) => setNewExam(e.target.value)}
                  placeholder="Exam name or performance"
                  className="border rounded px-3 py-2 flex-1"
                />
                <button
                  type="button"
                  onClick={handleAddExam}
                  className="bg-blue-600 text-white px-3 rounded"
                >
                  Add
                </button>
              </div>
              <ul className="list-disc pl-6 text-sm">
                {formData.previousExams.map((exam, idx) => (
                  <li key={idx}>{exam}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Fee Details */}
        {/* Fee Details */}
        <section>
          <h2 className="font-semibold text-lg mb-2">💰 Fee Details</h2>
          <div className="space-y-3">
            <div className="flex items-center">
              <label className="w-40 font-medium">Total Fee:</label>
              <input
                type="number"
                value={formData.fees.total}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    fees: { ...formData.fees, total: Number(e.target.value) },
                  })
                }
                className="border rounded px-3 py-2 flex-1"
              />
            </div>

            <div className="text-sm pl-40">
              <p>Paid: ₹{totalPaid}</p>
              <p>Remaining: ₹{remaining}</p>
              <p>
                Status:{" "}
                {formData.fees.feePaid ? (
                  <span className="text-green-600 font-medium">
                    ✅ Fully Paid
                  </span>
                ) : (
                  <span className="text-red-600 font-medium">❌ Not Paid</span>
                )}
              </p>
            </div>

            {/* Show Add Payment only if not fully paid */}
            {!formData.fees.feePaid && (
              <div className="border rounded p-3 bg-gray-50">
                <label className="font-medium block mb-2">Add Payment:</label>
                <div className="flex flex-wrap gap-3">
                  <input
                    type="number"
                    placeholder="Amount"
                    value={newPayment.amount}
                    onChange={(e) =>
                      setNewPayment({ ...newPayment, amount: e.target.value })
                    }
                    className="border rounded px-3 py-2"
                  />
                  <select
                    value={newPayment.paymentMode}
                    onChange={(e) =>
                      setNewPayment({
                        ...newPayment,
                        paymentMode: e.target.value,
                      })
                    }
                    className="border rounded px-3 py-2"
                  >
                    <option value="">Select Mode</option>
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                  <input
                    type="date"
                    value={newPayment.date}
                    onChange={(e) =>
                      setNewPayment({ ...newPayment, date: e.target.value })
                    }
                    className="border rounded px-3 py-2"
                  />
                  <input
                    placeholder="Receipt No."
                    value={newPayment.receiptNumber}
                    onChange={(e) =>
                      setNewPayment({
                        ...newPayment,
                        receiptNumber: e.target.value,
                      })
                    }
                    className="border rounded px-3 py-2"
                  />
                  <button
                    type="button"
                    onClick={handleAddPayment}
                    className="bg-blue-600 text-white px-3 rounded"
                  >
                    Add Payment
                  </button>
                </div>
              </div>
            )}

            {/* Payment History */}
            {formData?.fees?.paymentHistory?.length > 0 && (
              <ul className="mt-2 text-sm pl-40">
                {formData.fees.paymentHistory.map((p, idx) => (
                  <li key={idx}>
                    ₹{p.amount} | {p.paymentMode} |{" "}
                    {new Date(p.date).toLocaleDateString()} | Receipt:{" "}
                    {p.receiptNumber}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* 🩺 Other Information */}
        <section>
          <h2 className="font-semibold text-lg mb-2">🩺 Other Information</h2>
          <div className="space-y-3">
            <div className="flex items-center">
              <label className="w-40 font-medium" htmlFor="medicalConditions">
                Medical Conditions:
              </label>
              <textarea
                id="medicalConditions"
                name="medicalConditions"
                value={formData.medicalConditions}
                onChange={handleChange}
                className="border rounded px-3 py-2 flex-1"
              />
            </div>

            <div className="flex items-center">
              <label
                className="w-40 font-medium"
                htmlFor="emergencyContactName"
              >
                Emergency Contact Name:
              </label>
              <input
                id="emergencyContactName"
                name="emergencyContactName"
                value={formData.emergencyContactName}
                onChange={handleChange}
                className="border rounded px-3 py-2 flex-1"
              />
            </div>

            <div className="flex items-center">
              <label
                className="w-40 font-medium"
                htmlFor="emergencyContactNumber"
              >
                Emergency Contact Number:
              </label>
              <input
                id="emergencyContactNumber"
                name="emergencyContactNumber"
                value={formData.emergencyContactNumber}
                onChange={handleChange}
                className="border rounded px-3 py-2 flex-1"
              />
            </div>
          </div>
        </section>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded"
          >
            {student ? "Update Student" : "Create Student"}
          </button>
        </div>
      </div>
    </form>
  );
}
