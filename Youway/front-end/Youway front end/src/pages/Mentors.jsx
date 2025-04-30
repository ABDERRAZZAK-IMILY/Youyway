import { axiosClient } from "../api/axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";

export default function Mentor() {
  const [mentors, setMentors] = useState([]);

  useEffect(() => {
    axiosClient
      .get("/mentors")
      .then((res) => setMentors(res.data))
      .catch((err) => console.error("error fetching mentors:", err));
  }, []);

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {mentors.map((mentor) => (
        <div
          key={mentor.id}
          className="bg-white border-r-8 border-amber-500 rounded-2xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg"
        >
          <div className="aspect-square overflow-hidden  ">
            <img
              src={`http://localhost:80/storage/${mentor.image_path}`}
              alt={mentor.user.name}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>

          <div className="p-5">
            <div className="flex items-center gap-1 text-yellow-500 mb-2">
              <FaStar className="h-5 w-5" />
              <span className="font-medium">
                {(mentor.rating || 4.5).toFixed(1)}
              </span>
            </div>

            <h3 className="font-semibold text-lg">{mentor.user.name}</h3>
            <p className="text-gray-600 text-sm mb-2">{mentor.domaine}</p>
            <p className="text-gray-500 text-xs">{mentor.university}</p>

            <div className="mt-3">
              <span className="inline-block bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded font-medium">
                {mentor.competences}
              </span>
            </div>
          </div>

          <div className="px-5 pb-5 pt-0">
            <Link
              to={`/schedule-session?mentorId=${mentor.id}&mentorName=${encodeURIComponent(
                mentor.user.name
              )}`}
              className="block w-full text-center bg-green-500 text-white font-medium py-2 rounded hover:bg-blue-600 transition"
            >
              Planifier une session
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
