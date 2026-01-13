import { useRef, useState, useEffect } from "react";
import axios from "axios";

const dummyAchievements = [
  { name: "Rohit Patil", department: "Maharashtra Police", photo: "/students/rohit.jpg" },
  { name: "Ankita Deshmukh", department: "Maharashtra Police", photo: "/students/ankita.jpg" },
  { name: "Siddhesh Patil", department: "Maharashtra Police", photo: "/students/siddhesh.jpg" },
  { name: "Ramesh Sharma", department: "Maharashtra Police", photo: "/students/ramesh.jpg" },
  // ... add more if needed
];

export default function Achievements() {
  const scrollRef = useRef(null);
  const [achievements, setAchievements] = useState([]);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  // Fetch achievements from API
  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/achievements");
        if (res.data && res.data.length > 0) {
          setAchievements(res.data);
        } else {
          setAchievements(dummyAchievements);
        }
      } catch (err) {
        console.error(err);
        setAchievements(dummyAchievements);
      }
    };
    fetchAchievements();
  }, []);

  // Update scroll buttons
  const updateButtons = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeft(scrollLeft > 0);
    setShowRight(scrollLeft + clientWidth < scrollWidth - 1);
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "right" ? 300 : -300,
        behavior: "smooth",
      });
    }
  };

  // Update buttons whenever achievements change
  useEffect(() => {
    updateButtons();
  }, [achievements]);

  // Listen to scroll
useEffect(() => {
  if (!scrollRef.current) return;

  const handleScroll = () => updateButtons();

  const scrollEl = scrollRef.current; // store reference
  scrollEl.addEventListener("scroll", handleScroll);

  return () => {
    // make sure the element still exists
    if (scrollEl) {
      scrollEl.removeEventListener("scroll", handleScroll);
    }
  };
}, []);


  return (
    <section className="py-16 px-8 bg-white relative">
      <h2 className="text-3xl font-bold mb-6 text-center">Our Achievements</h2>

    {showLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white shadow-lg w-12 h-12 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors duration-300 z-10"
        >
          ◀
        </button>
      )}

      {showRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white shadow-lg w-12 h-12 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors duration-300 z-10"
        >
          ▶
        </button>
      )}

      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-6 scroll-smooth px-4 no-scrollbar"
        style={{ scrollbarWidth: "none", whiteSpace: "nowrap" }}
      >
        {achievements.map((ach, index) => (
          <div
            key={index}
            className="inline-block w-44 bg-gray-100 shadow rounded-lg p-3 flex-shrink-0"
          >
            <div className="w-full h-36 overflow-hidden rounded-lg mb-3">
              <img
                src={ach.photo}
                alt={ach.name}
                className="w-full h-full object-cover object-center"
              />
            </div>
            <h3 className="text-sm font-medium truncate">{ach.name}</h3>
            <p className="text-gray-700 text-xs truncate">{ach.department}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
