import React from "react";

export default function TeacherProfile({ teacher }) {
  if (!teacher) return <p>Loading profile...</p>;

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("en-IN") : "N/A";

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Your Profile</h2>

      <div className="grid grid-cols-2 gap-4 bg-white p-6 rounded shadow text-gray-800">
        {/* Basic Info */}
        <div>
          <p className="font-semibold">Name:</p>
          <p>{teacher.name}</p>
        </div>
        <div>
          <p className="font-semibold">Email:</p>
          <p>{teacher.email}</p>
        </div>
        <div>
          <p className="font-semibold">Mobile:</p>
          <p>{teacher.mobile}</p>
        </div>
        <div>
          <p className="font-semibold">Gender:</p>
          <p>{teacher.gender || "N/A"}</p>
        </div>
        <div>
          <p className="font-semibold">Date of Birth:</p>
          <p>{formatDate(teacher.dob)}</p>
        </div>
        <div>
          <p className="font-semibold">Address:</p>
          <p>{teacher.address || "N/A"}</p>
        </div>

        {/* Education */}
        <div>
          <p className="font-semibold">Highest Degree:</p>
          <p>{teacher.highestDegree || "N/A"}</p>
        </div>
        <div>
          <p className="font-semibold">College:</p>
          <p>{teacher.college || "N/A"}</p>
        </div>
        <div>
          <p className="font-semibold">Graduation Year:</p>
          <p>{teacher.graduationYear || "N/A"}</p>
        </div>
        <div>
          <p className="font-semibold">Certifications:</p>
          <p>{teacher.certifications?.join(", ") || "N/A"}</p>
        </div>

        {/* Experience */}
        <div>
          <p className="font-semibold">Teaching Experience:</p>
          <p>{teacher.teachingExperience || "N/A"} years</p>
        </div>
        <div>
          <p className="font-semibold">Previous Institutions:</p>
          <p>{teacher.previousInstitutions?.join(", ") || "N/A"}</p>
        </div>
        <div>
          <p className="font-semibold">Special Skills:</p>
          <p>{teacher.specialSkills?.join(", ") || "N/A"}</p>
        </div>
        <div>
          <p className="font-semibold">Subjects Taught:</p>
          <p>{teacher.subjectsTaught?.join(", ") || "N/A"}</p>
        </div>

        {/* Preferences */}
        <div>
          <p className="font-semibold">Availability Timings:</p>
          <p>{teacher.availabilityTimings?.join(", ") || "N/A"}</p>
        </div>
        <div>
          <p className="font-semibold">Preferred Days:</p>
          <p>{teacher.preferredDays?.join(", ") || "N/A"}</p>
        </div>
        <div>
          <p className="font-semibold">Willing to Travel:</p>
          <p>{teacher.willingToTravel ? "Yes" : "No"}</p>
        </div>
        <div>
          <p className="font-semibold">Online Teaching:</p>
          <p>{teacher.onlineTeaching ? "Yes" : "No"}</p>
        </div>

        {/* Workload and Salary */}
        <div>
          <p className="font-semibold">Max Students Per Batch:</p>
          <p>{teacher.maxStudentsPerBatch || "N/A"}</p>
        </div>
        <div>
          <p className="font-semibold">Expected Salary:</p>
          <p>₹{teacher.expectedSalary || "N/A"}</p>
        </div>

        {/* Notes */}
        <div className="col-span-2">
          <p className="font-semibold">Additional Notes:</p>
          <p>{teacher.additionalNotes || "None"}</p>
        </div>

        {/* Status */}
        <div>
          <p className="font-semibold">Status:</p>
          <p>{teacher.isActive ? "Active" : "Inactive"}</p>
        </div>

        <div>
          <p className="font-semibold">Created At:</p>
          <p>{formatDate(teacher.createdAt)}</p>
        </div>
        <div>
          <p className="font-semibold">Updated At:</p>
          <p>{formatDate(teacher.updatedAt)}</p>
        </div>
      </div>
    </section>
  );
}
