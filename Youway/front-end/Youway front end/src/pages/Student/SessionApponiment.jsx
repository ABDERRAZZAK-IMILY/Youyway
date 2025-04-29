
import { axiosClient } from "../../api/axios";

import { useState , useEffect } from "react";



 
 







export default function SessionApponiment(){

     const [data, setdata] = useState([]);

     useEffect(() => {

     const fetchdata = async ()  =>{

        const  Sessions = await axiosClient.get('/sessions');

      setdata(Sessions.data);
    
     }   
  
fetchdata();

}, []);


    return(

<>
      {data.map((s) => (
        <div key={s.id}>
          <h3>{s.title}</h3>
          <p>{s.description}</p>
        </div>
      ))}









</>
    );
}


