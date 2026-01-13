import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function TeacherForm({
  teacher,
  batchSubjects = ["Math", "English", "Reasoning", "Marathi Grammar"],
  onSuccess,
}) {
  const token = localStorage.getItem("token");

  const initialFormData = {
    name: "",
    dob: "",
    gender: "",
    mobile: "",
    email: "",
    address: "",
    password: "",
    highestDegree: "",
    college: "",
    graduationYear: "",
    certifications: "",
    teachingExperience: "",
    previousInstitutions: "",
    specialSkills: "",
    subjectsTaught: [],
    availabilityTimings: [],
    preferredDays: "",
    willingToTravel: false,
    onlineTeaching: false,
    maxStudentsPerBatch: "",
    expectedSalary: "",
    additionalNotes: "",
    isActive: true,
    documents: {
      adharNumber: "",
      panNumber: "",
      bank: "",
    },
    salary: {
      accountNumber: "",
    },
  };

  const [formData, setFormData] = useState(initialFormData);
  const [subjectInput, setSubjectInput] = useState("");
  const [timingInput, setTimingInput] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (teacher) {
      setFormData({
        ...teacher,
        dob: teacher.dob?.slice(0, 10) || "",
        password: "",
      });
    }
  }, [teacher]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const addSubject = () => {
    if (!subjectInput) return;
    if (!batchSubjects.includes(subjectInput)) return;
    if (formData.subjectsTaught.includes(subjectInput)) return;

    setFormData({
      ...formData,
      subjectsTaught: [...formData.subjectsTaught, subjectInput],
    });
    setSubjectInput("");
  };

  const removeSubject = (subject) => {
    setFormData({
      ...formData,
      subjectsTaught: formData.subjectsTaught.filter((s) => s !== subject),
    });
  };

  const addTiming = () => {
    if (!timingInput) return;
    if (formData.availabilityTimings.includes(timingInput)) return;

    setFormData({
      ...formData,
      availabilityTimings: [...formData.availabilityTimings, timingInput],
    });
    setTimingInput("");
  };

  const removeTiming = (timing) => {
    setFormData({
      ...formData,
      availabilityTimings: formData.availabilityTimings.filter(
        (t) => t !== timing
      ),
    });
  };

  const validate = () => {
    let tempErrors = {};
    Object.keys(formData).forEach((key) => {
      if (
        (Array.isArray(formData[key]) && formData[key].length === 0) ||
        (!Array.isArray(formData[key]) && !formData[key])
      ) {
        // if (key === "preferredDays" || key === "documents" || key === "salary") return;

        tempErrors[key] = "This field is required";
      }
    });
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (!validate()) return;

    try {
      // Create a copy of formData to modify before sending
      const submitData = { ...formData };
      if (Array.isArray(submitData.preferredDays)) {
        submitData.submitData = submitData.preferredDays.join(",");
      }

      // If updating and password is empty, remove it so backend doesn't overwrite
      if (teacher && !submitData.password) {
        delete submitData.password;
      }

      if (teacher) {
        await axios.put(
          `http://localhost:4000/api/teachers/${teacher._id}`,
          submitData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Teacher updated successfully ✅");
      } else {
        await axios.post(`http://localhost:4000/api/teachers`, submitData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Teacher created successfully 🎉");
      }
      onSuccess();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong ❌");
    }
  };

  const renderInput = (label, name, type = "text") => (
    <div className="flex items-center gap-2 mb-3">
      <label className="w-40 font-medium">{label}:</label>
      <input
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        className={`border rounded px-3 py-2 flex-1 ${
          errors[name] ? "border-red-500" : ""
        }`}
      />
      {errors[name] && (
        <span className="text-red-500 text-sm">{errors[name]}</span>
      )}
    </div>
  );

  return (
    <div className="max-h-[70vh] overflow-y-auto p-4">
      <form onSubmit={handleSubmit}>
        <h2 className="font-semibold text-lg mb-2">Personal Information</h2>
        {renderInput("Full Name", "name")}
        {renderInput("Date of Birth", "dob", "date")}
        <div className="flex items-center gap-2 mb-3">
          <label className="w-40 font-medium">Gender:</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className={`border rounded px-3 py-2 flex-1 ${
              errors.gender ? "border-red-500" : ""
            }`}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && (
            <span className="text-red-500 text-sm">{errors.gender}</span>
          )}
        </div>
        {renderInput("Mobile", "mobile")}
        {renderInput("Email", "email", "email")}
        {renderInput("Password", "password", "password")}
        {renderInput("Address", "address")}

        <h2 className="font-semibold text-lg mb-2 mt-4">Education</h2>
        {renderInput("Highest Degree", "highestDegree")}
        {renderInput("College / University", "college")}
        {renderInput("Graduation Year", "graduationYear", "number")}
        {renderInput("Certifications", "certifications")}

        <h2 className="font-semibold text-lg mb-2 mt-4">
          Professional Experience
        </h2>
        {renderInput(
          "Teaching Experience (years)",
          "teachingExperience",
          "number"
        )}
        {renderInput("Previous Institutions", "previousInstitutions")}
        {renderInput("Special Skills", "specialSkills")}

        <h3 className="font-medium mb-2">Subjects Taught</h3>
        <div className="flex items-center gap-2 mb-3">
          <select
            value={subjectInput}
            onChange={(e) => setSubjectInput(e.target.value)}
            className="border rounded px-3 py-2 flex-1"
          >
            <option value="">Select Subject</option>
            {batchSubjects.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={addSubject}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {formData.subjectsTaught.map((sub) => (
            <span
              key={sub}
              className="bg-gray-200 px-3 py-1 rounded flex items-center gap-1"
            >
              {sub}{" "}
              <button type="button" onClick={() => removeSubject(sub)}>
                x
              </button>
            </span>
          ))}
          {errors.subjectsTaught && (
            <span className="text-red-500 text-sm">
              {errors.subjectsTaught}
            </span>
          )}
        </div>

        <h3 className="font-medium mb-2">Availability Timings</h3>
        <div className="flex items-center gap-2 mb-3">
          <input
            type="time"
            value={timingInput}
            onChange={(e) => setTimingInput(e.target.value)}
            className="border rounded px-3 py-2 flex-1"
          />
          <button
            type="button"
            onClick={addTiming}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {formData.availabilityTimings.map((time, idx) => (
            <span
              key={idx}
              className="bg-gray-200 px-3 py-1 rounded flex items-center gap-1"
            >
              {time}{" "}
              <button type="button" onClick={() => removeTiming(time)}>
                x
              </button>
            </span>
          ))}
          {errors.availabilityTimings && (
            <span className="text-red-500 text-sm">
              {errors.availabilityTimings}
            </span>
          )}
        </div>

        <h2 className="font-semibold text-lg mb-2 mt-4">Other Availability</h2>
        {renderInput("Preferred Days", "preferredDays")}
        <div className="flex items-center gap-4 mb-3">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="willingToTravel"
              checked={formData.willingToTravel}
              onChange={handleChange}
            />
            Willing to Travel
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="onlineTeaching"
              checked={formData.onlineTeaching}
              onChange={handleChange}
            />
            Online Teaching
          </label>
        </div>
        {renderInput("Max Students per Batch", "maxStudentsPerBatch", "number")}
        {renderInput("Expected Salary", "expectedSalary")}
        {renderInput("Additional Notes", "additionalNotes")}

        <label className="flex items-center gap-2 mt-4 mb-4">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
          />
          Active
        </label>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {teacher ? "Update" : "Create"}
        </button>
      </form>
    </div>
  );
}
