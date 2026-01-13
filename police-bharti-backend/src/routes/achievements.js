// src/routes/achievements.js
const express = require("express");
const router = express.Router();

// Temporary hardcoded data
const achievements = [
  { name: "Rohit Patil", department: "Maharashtra Police", photo: "/students/rohit.jpg" },
  { name: "Ankita Deshmukh", department: "Maharashtra Police", photo: "/students/ankita.jpg" },
  { name: "Siddhesh Patil", department: "Maharashtra Police", photo: "/students/siddhesh.jpg" },
  { name: "Ramesh Sharma", department: "Maharashtra Police", photo: "/students/ramesh.jpg" },
   { name: "Rohit Patil", department: "Maharashtra Police", photo: "/students/rohit.jpg" },
  { name: "Ankita Deshmukh", department: "Maharashtra Police", photo: "/students/ankita.jpg" },
  { name: "Siddhesh Patil", department: "Maharashtra Police", photo: "/students/siddhesh.jpg" },
  { name: "Ramesh Sharma", department: "Maharashtra Police", photo: "/students/ramesh.jpg" },
   { name: "Rohit Patil", department: "Maharashtra Police", photo: "/students/rohit.jpg" },
  { name: "Ankita Deshmukh", department: "Maharashtra Police", photo: "/students/ankita.jpg" },
  { name: "Siddhesh Patil", department: "Maharashtra Police", photo: "/students/siddhesh.jpg" },
  { name: "Ramesh Sharma", department: "Maharashtra Police", photo: "/students/ramesh.jpg" },
   { name: "Rohit Patil", department: "Maharashtra Police", photo: "/students/rohit.jpg" },
  { name: "Ankita Deshmukh", department: "Maharashtra Police", photo: "/students/ankita.jpg" },
  { name: "Siddhesh Patil", department: "Maharashtra Police", photo: "/students/siddhesh.jpg" },
  { name: "Ramesh Sharma", department: "Maharashtra Police", photo: "/students/ramesh.jpg" },
   { name: "Rohit Patil", department: "Maharashtra Police", photo: "/students/rohit.jpg" },
  { name: "Ankita Deshmukh", department: "Maharashtra Police", photo: "/students/ankita.jpg" },
  { name: "Siddhesh Patil", department: "Maharashtra Police", photo: "/students/siddhesh.jpg" },
  { name: "Ramesh Sharma", department: "Maharashtra Police", photo: "/students/ramesh.jpg" },
];

router.get("/", async (req, res) => {
  try {
    // In future, fetch from MongoDB
    res.json(achievements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
