import { axiosClient } from "../api/axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Mentor() {
  const [mentors, setMentors] = useState([]);
  const [studentId, setStudentId] = useState(null);

  useEffect(() => {
    axiosClient.get('/my-student')
      .then(res => setStudentId(res.data.id))
      .catch(err => console.error('student not found', err));
  }, []);

  useEffect(() => {
    axiosClient.get('/mentors')
      .then(res => setMentors(res.data))
      .catch(err => console.error("error fetching mentors:", err));
  }, []);

  return (
    <div className="mentors-container">
      {mentors.map((mentor) => (
        <div key={mentor.id} className="mentor-card">
<img src={`http://localhost:80/storage/${mentor.image_path}`} alt={mentor.user.name} />
          <h3>{mentor.user.name}</h3>
          <p><strong>Competences:</strong> {mentor.competences}</p>
          <p><strong>Disponibilites:</strong> {mentor.disponibilites}</p>
          <p><strong>Domaine:</strong> {mentor.domaine}</p>
          <p><strong>University:</strong> {mentor.university}</p>

          <Link to={`/book-session/${mentor.id}`} className="bg-blue-500 text-white px-3 py-1 rounded mt-2 inline-block">
            Book Session
          </Link>
        </div>
      ))}
    </div>
  );
}
