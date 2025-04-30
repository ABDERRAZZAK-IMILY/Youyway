import { axiosClient } from "../../api/axios";
import { useState, useEffect } from "react";

export default function Mentor() {
  const [data, setData] = useState([]);
  const [studentId, setStudentId] = useState(null);

  useEffect(() => {
    axiosClient.get('/my-student')
      .then(res => setStudentId(res.data.id))
      .catch(err => console.error('student not found', err));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosClient.get('/sessions');
        setData(response.data);
      } catch (error) {
        console.error("error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (sessionId, e) => {
    e.preventDefault();

    try {
      const response = await axiosClient.post('/sessions', {
      

      });

      console.log(response.data.message);
    } catch (error) {
      console.error("booking error:", error.response?.data);
    }
  };

  return (
    <div className="sessions-container">
      {data.map((s) => (
        <div key={s.id} className="session-card">
          <img src={`http://localhost:80/storage/${s.mentor.user.image_path}`} alt={s.title} className="session-image" />
          <h3>{s.title}</h3>
          <p>{s.description}</p>

          <p><strong>Start:</strong> {s.start_time}</p>
          <p><strong>End:</strong> {s.end_time}</p>
          <h4>Mentor Info:</h4>
          <p><strong>Name:</strong> {s.mentor.user.name}</p>
          <p><strong>Competences:</strong> {s.mentor.competences}</p>
          <p><strong>Disponibilites:</strong> {s.mentor.disponibilites}</p>
          <p><strong>Domaine:</strong> {s.mentor.domaine}</p>
          <p><strong>University:</strong> {s.mentor.university}</p>

          <form onSubmit={(e) => handleSubmit(s.id, e)}>
            <button type="submit">Book Session</button>
          </form>
        </div>
      ))}
    </div>
  );
}
