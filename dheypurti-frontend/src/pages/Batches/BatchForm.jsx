import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ALL_SUBJECTS = [
  "Math",
  "English",
  "Reasoning",
  "Marathi Grammar"
];

export default function BatchForm({ batch, teachers, onSuccess }) {
  const token = localStorage.getItem("token");

  const [title, setTitle] = useState(batch?.title || "");
  const [startDate, setStartDate] = useState(batch?.startDate?.substring(0, 10) || "");
  const [endDate, setEndDate] = useState(batch?.endDate?.substring(0, 10) || "");
  const [startTime, setStartTime] = useState(batch?.timing?.split(" - ")[0] || "08:00");
  const [endTime, setEndTime] = useState(batch?.timing?.split(" - ")[1] || "09:00");
  const [selectedTeachers, setSelectedTeachers] = useState(batch?.teachers?.map(t => t._id) || []);
  const [selectedSubjects, setSelectedSubjects] = useState(
    batch?.subjects?.map(s => s.name) || []
  );
  const [subjectTeachers, setSubjectTeachers] = useState(
    batch?.subjects?.reduce((acc, s) => ({ ...acc, [s.name]: s.teacher || "" }), {}) || {}
  );

  const toggleSubject = (subject) => {
    setSelectedSubjects(prev =>
      prev.includes(subject)
        ? prev.filter(s => s !== subject)
        : [...prev, subject]
    );
  };

  const handleSubjectTeacherChange = (subject, teacherId) => {
    setSubjectTeachers(prev => ({ ...prev, [subject]: teacherId }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Combine startTime and endTime
    const timing = `${startTime} - ${endTime}`;

    const payload = {
      title,
      startDate,
      endDate,
      timing,
      teachers: selectedTeachers,
      subjects: selectedSubjects.map(name => ({
        name,
        teacher: subjectTeachers[name] || null
      }))
    };

    try {
      if (batch) {
        // Update existing batch
        await axios.put(
          `http://localhost:4000/api/batches/${batch._id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("✅ Batch updated successfully");
      } else {
        // Create new batch
        await axios.post(
          "http://localhost:4000/api/batches",
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("✅ Batch created successfully");
      }
      onSuccess(); // refresh batch list and close modal
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="max-h-[70vh] overflow-y-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Batch Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            required
          />
        </div>

        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block font-medium">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border rounded px-3 py-2 w-full"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block font-medium">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border rounded px-3 py-2 w-full"
              required
            />
          </div>
        </div>

        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block font-medium">Start Time</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="border rounded px-3 py-2 w-full"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block font-medium">End Time</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="border rounded px-3 py-2 w-full"
              required
            />
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1">Select Teachers (optional)</label>
          {teachers.map(t => (
            <label key={t._id} className="block text-sm">
              <input
                type="checkbox"
                value={t._id}
                checked={selectedTeachers.includes(t._id)}
                onChange={() =>
                  setSelectedTeachers(prev =>
                    prev.includes(t._id)
                      ? prev.filter(id => id !== t._id)
                      : [...prev, t._id]
                  )
                }
                className="mr-2"
              />
              {t.name} ({t.email})
            </label>
          ))}
        </div>

        <div className="border-t pt-3">
          <h3 className="font-semibold mb-2">Select Subjects (Optional)</h3>
          {ALL_SUBJECTS.map(subject => (
            <div key={subject} className="mb-2 flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedSubjects.includes(subject)}
                onChange={() => toggleSubject(subject)}
              />
              <span className="font-medium">{subject}</span>

              {selectedSubjects.includes(subject) && (
                <select
                  value={subjectTeachers[subject] || ""}
                  onChange={(e) => handleSubjectTeacherChange(subject, e.target.value)}
                  className="border rounded px-2 py-1 ml-2"
                >
                  <option value="">Select Teacher (optional)</option>
                  {teachers.map(t => (
                    <option key={t._id} value={t._id}>{t.name}</option>
                  ))}
                </select>
              )}
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {batch ? "Update Batch" : "Save Batch"}
        </button>
      </form>
    </div>
  );
}
