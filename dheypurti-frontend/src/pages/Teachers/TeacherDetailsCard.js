import React from "react";

export default function TeacherDetailsCard({ teacher }) {
  if (!teacher) return <p>No teacher data available.</p>;

  const renderField = (label, value) => (
    <div className="flex flex-col mb-2">
      <span className="font-semibold text-gray-700">{label}</span>
      <span className="text-gray-900">{value || "-"}</span>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">{teacher.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Personal Info */}
        <div className="border p-4 rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
          {renderField("Date of Birth", teacher.dob?.slice(0, 10))}
          {renderField("Gender", teacher.gender)}
          {renderField("Mobile", teacher.mobile)}
          {renderField("Email", teacher.email)}
          {renderField("Address", teacher.address)}
        </div>

        {/* Education */}
        <div className="border p-4 rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">Education</h2>
          {renderField("Highest Degree", teacher.highestDegree)}
          {renderField("College / University", teacher.college)}
          {renderField("Graduation Year", teacher.graduationYear)}
          {renderField("Certifications", teacher.certifications)}
        </div>

        {/* Professional Experience */}
        <div className="border p-4 rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">Professional Experience</h2>
          {renderField("Teaching Experience (years)", teacher.teachingExperience)}
          {renderField("Previous Institutions", teacher.previousInstitutions)}
          {renderField("Special Skills", teacher.specialSkills)}
        </div>

        {/* Subjects & Availability */}
        <div className="border p-4 rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">Subjects & Availability</h2>
          {renderField("Subjects Taught", teacher.subjectsTaught?.join(", "))}
          {renderField("Availability Timings", teacher.availabilityTimings?.join(", "))}
          {renderField("Preferred Days", teacher.preferredDays)}
          {renderField("Willing to Travel", teacher.willingToTravel ? "Yes" : "No")}
          {renderField("Online Teaching", teacher.onlineTeaching ? "Yes" : "No")}
          {renderField("Max Students per Batch", teacher.maxStudentsPerBatch)}
        </div>

        {/* Documents */}
        <div className="border p-4 rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">Documents</h2>
          {renderField("Aadhar Number", teacher.documents?.adharNumber)}
          {renderField("PAN Number", teacher.documents?.panNumber)}
          {renderField("Bank", teacher.documents?.bank)}
        </div>

        {/* Salary & Notes */}
        <div className="border p-4 rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">Salary & Notes</h2>
          {renderField("Expected Salary", teacher.expectedSalary)}
          {renderField("Account Number", teacher.salary?.accountNumber)}
          {renderField("Additional Notes", teacher.additionalNotes)}
          {renderField("Status", teacher.isActive ? "Active" : "Inactive")}
        </div>

      </div>
    </div>
  );
}
