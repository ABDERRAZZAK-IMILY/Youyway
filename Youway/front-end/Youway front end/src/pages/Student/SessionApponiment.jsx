import { axiosClient } from "../../api/axios";
import { useState, useEffect } from "react";

export default function SessionApponiment() {
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
      const response = await axiosClient.post('/book', {
        student_id: studentId,
        session_id: sessionId,
      });

      console.log(response.data.message);
    } catch (error) {
      console.error("booking eror:", error.response?.data);
    }
  };

  return (
    <>
      {data.map((s) => (
        <div key={s.id} className="session-card">
          <img src={`http://localhost:80/storage/${s.image_path}`} alt={s.title} className="session-image" />
          <h3>{s.title}</h3>
          <p>{s.description}</p>

          <form onSubmit={(e) => handleSubmit(s.id, e)}>
            <button type="submit">Book Session</button>
          </form>
        </div>
      ))}
    </>
  );
}
