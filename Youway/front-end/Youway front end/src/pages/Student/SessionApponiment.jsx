import { axiosClient } from "../../api/axios";
import { useState, useEffect } from "react";

export default function SessionApponiment() {
  const [data, setData] = useState([]);
  const [book , setbook] = useState();

  useEffect(() => {
      axiosClient.get('/my-student')
      .then(res => setbook(( res.data.id )))
      .catch(err => console.error('student not found', err));
    }, []);

    
    console.log(book);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosClient.get('/sessions');
        setData(response.data);
      } catch (error) {
        console.error("eroore fecth data:", error);
      }
    };

    fetchData();
  }, []);






  return (
    <>
      {data.map((s) => (
        <div key={s.id} className="session-card">
<img src={`http://localhost:80/storage/${s.image_path}`} alt={s.title} className="session-image" />
<h3>{s.title}</h3>
          <p>{s.description}</p>
        </div>
      ))}
    </>
  );
}
