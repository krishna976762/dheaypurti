import { useEffect, useState } from "react";
import axios from "axios";

export default function BatchInfo() {
  const [batches, setBatches] = useState([]);
  const [expanded, setExpanded] = useState(null);

  // Dummy data to use if API returns empty
  const dummyBatches = [
    { _id: "1", name: "Police Bharti Batch A", startDate: "2025-10-01", subjects: ["General Knowledge", "Current Affairs"], teacherName: "Ramesh Sharma",banner:"batch" },
    { _id: "2", name: "Police Bharti Batch B", startDate: "2025-11-01", subjects: ["Reasoning", "Math"], teacherName: "Siddhesh Patil",banner:"batch" },
    { _id: "3", name: "Police Bharti Batch C", startDate: "2025-12-01", subjects: ["English", "GK"], teacherName: "Ankita Deshmukh",banner:"batch"},
    { _id: "1", name: "Police Bharti Batch A", startDate: "2025-10-01", subjects: ["General Knowledge", "Current Affairs"], teacherName: "Ramesh Sharma",banner:"batch" },
    { _id: "2", name: "Police Bharti Batch B", startDate: "2025-11-01", subjects: ["Reasoning", "Math"], teacherName: "Siddhesh Patil",banner:"batch" },
    { _id: "3", name: "Police Bharti Batch C", startDate: "2025-12-01", subjects: ["English", "GK"], teacherName: "Ankita Deshmukh",banner:"batch" },
    { _id: "1", name: "Police Bharti Batch A", startDate: "2025-10-01", subjects: ["General Knowledge", "Current Affairs"], teacherName: "Ramesh Sharma",banner:"batch" },
    { _id: "2", name: "Police Bharti Batch B", startDate: "2025-11-01", subjects: ["Reasoning", "Math"], teacherName: "Siddhesh Patil" ,banner:"batch"},
    { _id: "3", name: "Police Bharti Batch C", startDate: "2025-12-01", subjects: ["English", "GK"], teacherName: "Ankita Deshmukh",banner:"batch" },
  ];

  useEffect(() => {
    axios.get("http://localhost:4000/api/batches")
      .then(res => {
        // Use API data if available, otherwise use dummy
        if (res.data?.batches?.length > 0) {
          setBatches(dummyBatches);
          // setBatches(res.data.batches);
        } else {
          setBatches(dummyBatches);
        }
      })
      .catch(err => {
        console.error(err);
        // On error, show dummy data
        setBatches(dummyBatches);
      });
  }, []);

  return (
    <section className="bg-gray-100 py-8 px-4 text-center">
      <h2 className="text-3xl font-semibold mb-4">Our Batches</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {batches.map((batch, index) => (
          <div key={batch._id} className="bg-white shadow-md p-4 rounded-lg">
            <h3 className="text-xl font-bold mb-2">{batch.name}</h3>
            {batch.banner && (
  <img
    src={`/${batch.banner}.jpg`}
    alt={`${batch.name} banner`}
    className="w-full h-48 object-cover rounded-md mb-2"
  />
)}
            <p className="mb-2">Start Date: {new Date(batch.startDate).toLocaleDateString()}</p>
            <button
              onClick={() => setExpanded(expanded === index ? null : index)}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              {expanded === index ? "Hide Details" : "View More"}
            </button>

            {expanded === index && (
              <div className="mt-2 text-left">
                <p><strong>Teacher:</strong> {batch.teacherName}</p>
                <p><strong>Subjects:</strong> {batch.subjects?.join(", ")}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
