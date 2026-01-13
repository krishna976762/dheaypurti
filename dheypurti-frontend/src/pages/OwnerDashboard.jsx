import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Table from "../components/Table";
import { Link, useNavigate } from "react-router-dom";

export default function OwnerDashboard() { 
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [batches, setBatches] = useState([]);
  const [expandedTeacher, setExpandedTeacher] = useState(null);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [formData, setFormData] = useState({});
  const [showTeacherForm, setShowTeacherForm] = useState(false);
  const [teacherForm, setTeacherForm] = useState({
    name: "",
    email: "",
    password: "",
    dob: "",
    address: "",
    mobile: "",
    photo: null,
    adhar: null,
  });
  const [batchForm, setBatchForm] = useState({
    title: "",
    startDate: "",
    endDate: "",
    teacher: "",
  });
 const toggleExpand = (id) => {
    setExpandedTeacher(expandedTeacher === id ? null : id);
  };
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchTeachers();
    fetchBatches();
  }, []);

  // const fetchTeachers = async () => {
  //   try {
  //     const res = await axios.get("http://localhost:4000/api/teachers", {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     setTeachers(res.data.teachers);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  const fetchBatches = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/batches", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBatches(res.data.batches);
    } catch (err) {
      console.error(err);
    }
  };

  // Create Teacher with file upload
  const createTeacher = async (e) => {
    e.preventDefault();

    // Validate all fields
    const { name, email, password, dob, address, mobile } = teacherForm;
    if (!name || !email || !password || !dob || !address || !mobile) {
      alert("Please fill all fields");
      return;
    }

    try {
      const formData = new FormData();
      // Object.keys(teacherForm).forEach((key) => {
      //    if (teacherForm[key]) formData.append(key, teacherForm[key]);
      //  });
      ['name', 'email', 'password', 'dob', 'address', 'mobile'].forEach((key) => {
  formData.append(key, teacherForm[key]);
});
if (teacherForm.photo instanceof File) {
  formData.append('photo', teacherForm.photo);
}
if (teacherForm.adhar instanceof File) {
  formData.append('adhar', teacherForm.adhar);
}

      await axios.post("http://localhost:4000/api/teachers", formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      fetchTeachers();
      setTeacherForm({
        name: "",
        email: "",
        password: "",
        dob: "",
        address: "",
        mobile: "",
        photo: null,
        adhar: null,
      });
      setShowTeacherForm(false);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error creating teacher");
    }
  };

  // Create Batch
  const createBatch = async () => {
    if (!batchForm.title || !batchForm.startDate || !batchForm.endDate) {
      alert("Please fill all batch fields");
      return;
    }

    try {
      await axios.post("http://localhost:4000/api/batches", batchForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBatches();
      setBatchForm({ title: "", startDate: "", endDate: "", teacher: "" });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error creating batch");
    }
  };

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
    setFormData({ ...teacher });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:4000/api/users/${editingTeacher._id}`, formData);
      alert("Teacher updated successfully!");
      setEditingTeacher(null);
      fetchTeachers();
    } catch (err) {
      console.error(err);
      alert("Error updating teacher");
    }
  };

  // NEW changes
  // const token = localStorage.getItem("token");
  // const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  // const [batches, setBatches] = useState([]);

  useEffect(() => {
    fetchTeachers();
    fetchStudents();
    fetchBatches();
  }, []);

  const fetchTeachers = async () => {
    const res = await axios.get("http://localhost:4000/api/teachers", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTeachers(res.data.teachers);
  };

  const fetchStudents = async () => {
    const res = await axios.get("http://localhost:4000/api/students", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setStudents(res.data.students);
  };

 


  return (
   
     <div className="flex min-h-screen bg-gray-50"> 

      {/* Main content */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        {/* Teachers Summary */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">Teachers</h2>
            <button
              onClick={() => navigate("/dashboard/teachers")}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              View All
            </button>
          </div>
          <Table
            columns={[
              { key: "name", label: "Name" },
              { key: "email", label: "Email" },
              { key: "mobile", label: "Mobile" },
              { key: "isActive", label: "Status" },
            ]}
            data={teachers.slice(0, 5).map((t) => ({
              ...t,
              isActive: t.isActive ? "Active" : "Inactive",
            }))}
          />
        </div>

        {/* Students Summary */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">Students</h2>
            <button
              onClick={() => navigate("/dashboard/students")}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              View All
            </button>
          </div>
          <Table
            columns={[
              { key: "fullName", label: "Name" },
              { key: "email", label: "Email" },
              { key: "studentContact", label: "Mobile" },
              { key: "isActive", label: "Status" },
            ]}
            data={students.slice(0, 5).map((s) => ({
              ...s,
              isActive: s.isActive ? "Active" : "Inactive",
            }))}
          />
        </div>

        {/* Batches Summary */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">Batches</h2>
            <button
              onClick={() => navigate("/dashboard/batches")}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              View All
            </button>
          </div>
         <Table
  columns={[
    { key: "title", label: "Title" },
    { key: "teacherName", label: "Teacher" },
    { key: "startDate", label: "Start Date" },
    { key: "endDate", label: "End Date" },
  ]}
  data={batches.slice(0, 5).map((b) => ({
    ...b,
    teacherName: b.teacher?.name || "N/A",
    startDate: new Date(b.startDate).toLocaleDateString("en-IN"),
    endDate: new Date(b.endDate).toLocaleDateString("en-IN"),
  }))}
/>

        </div>
      </div>
    </div>
  );
}

