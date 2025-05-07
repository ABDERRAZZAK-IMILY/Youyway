import React, { useState, useEffect } from 'react';
import { axiosClient } from '../../api/axios';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { FaCalendarAlt, FaInfoCircle } from 'react-icons/fa';

export default function SessionCreate() {
  const { mentorId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    mentor_id: '',
    student_id: '',
    title: '',
    description: '',
    start_time: '',
    end_time: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [mentor, setMentor] = useState(null);
  const [availabilitySlots, setAvailabilitySlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [studentProfile, setStudentProfile] = useState(null);
  const [loadingStudentProfile, setLoadingStudentProfile] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        try {
          setLoadingStudentProfile(true);
          const { data: student } = await axios.get('http://localhost:80/api/my-student', {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          console.log('Student profile fetched successfully:', student);
          setStudentProfile(student);
          
          setForm(prev => ({
            ...prev,
            student_id: student.id
          }));
        } catch (studentError) {
          console.error('Error fetching student profile:', studentError);
          
          if (studentError.response?.status === 404) {
            setErrors(prev => ({
              ...prev,
              student_id: ['Votre profil étudiant n\'existe pas. Veuillez contacter l\'administrateur.']
            }));
          }
        } finally {
          setLoadingStudentProfile(false);
        }

        const { data: mentorData } = await axios.get(`http://localhost:80/api/mentors/${mentorId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMentor(mentorData);
        
        const { data: availabilityData } = await axios.get(`http://localhost:80/api/mentor-availability/${mentorId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAvailabilitySlots(availabilityData);
        
        setForm(prev => ({
          ...prev,
          mentor_id: mentorId,
        }));
      } catch (e) {
        console.error("Error fetching data:", e);
        setErrors({ general: "Error loading mentor data or availability" });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [mentorId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
    }));
    
    if (name === 'date') {
      setSelectedDate(value);
      setSelectedSlot(null);
    }
  };
  
  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    
    const formattedStartTime = new Date(slot.start_time).toISOString();
    const formattedEndTime = new Date(slot.end_time).toISOString();
    
    setForm(prev => ({
      ...prev,
      start_time: formattedStartTime,
      end_time: formattedEndTime
    }));
  };
  
  const getAvailableSlotsForDate = () => {
    if (!selectedDate) return [];
    
    return availabilitySlots.filter(slot => {
      const slotDate = new Date(slot.date).toISOString().split('T')[0];
      return slotDate === selectedDate;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!form.mentor_id) {
      setErrors({ mentor_id: ["Mentor ID is required"] });
      return;
    }

    if (!form.student_id) {
      setErrors({ student_id: ["Votre profil étudiant est requis"] });
      return;
    }

    if (!form.title) {
      setErrors({ title: ["Le titre est requis"] });
      return;
    }

    if (!selectedSlot) {
      setErrors({ general: "Veuillez sélectionner une disponibilité" });
      return;
    }

    try {
      setLoading(true);
      
      const token = localStorage.getItem('token');

      const sessionData = {
        mentor_id: parseInt(form.mentor_id),
        student_id: parseInt(form.student_id),
        start_time: form.start_time,
        end_time: form.end_time,
        title: form.title,
        description: form.description || '',
        call_link: 'placeholder'
      };
      
      console.log("Creating session with data:", sessionData);
      
      const response = await axios.post('http://localhost:80/api/sessions', sessionData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      console.log('Session created successfully:', response.data);
      
      navigate('/studentdashboard/mysessions');
    } catch (error) {
      console.error("Error creating session:", error);
      
      if (error.response?.status === 422 && error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ 
          general: error.response?.data?.message || 
                  "Impossible de créer la session. Veuillez réessayer plus tard ou contacter l'administrateur."
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Réserver une session</h1>
        {mentor && (
          <p className="text-gray-600">
            Avec {mentor.user?.name || "Mentor"}, {mentor.competences || ""}
          </p>
        )}
      </div>

      {errors.general && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errors.general}
        </div>
      )}

      {errors.student_id && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          {errors.student_id[0]}
        </div>
      )}

      {loading ? (
        <p className="text-gray-500">Chargement des informations...</p>
      ) : !studentProfile && !loadingStudentProfile ? (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 p-4 rounded mb-4">
          <h3 className="font-bold text-lg mb-2">Profil étudiant non trouvé</h3>
          <p>Vous devez avoir un profil étudiant pour réserver une session.</p>
          <p>Veuillez contacter l'administrateur pour créer votre profil étudiant.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1 font-medium">Titre de la session</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full border rounded p-2"
              placeholder="Ex: Aide avec JavaScript"
            />
            {errors.title && <p className="text-red-500">{errors.title[0]}</p>}
          </div>

          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border rounded p-2"
              rows="3"
              placeholder="Décrivez vos besoins pour cette session"
            />
            {errors.description && <p className="text-red-500">{errors.description[0]}</p>}
          </div>

          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <FaCalendarAlt className="mr-2 text-blue-600" />
              Sélectionner une disponibilité
            </h3>
            
            {availabilitySlots.length === 0 ? (
              <p className="text-gray-500 italic">Ce mentor n'a pas encore ajouté de disponibilités.</p>
            ) : (
              <>
                <div className="mb-4">
                  <label className="block mb-1 font-medium">Date</label>
                  <select 
                    name="date" 
                    onChange={handleChange}
                    value={selectedDate}
                    className="w-full border rounded p-2"
                  >
                    <option value="">Sélectionnez une date</option>
                    {[...new Set(availabilitySlots.map(slot => {
                      return new Date(slot.date).toISOString().split('T')[0];
                    }))].sort().map(date => (
                      <option key={date} value={date}>
                        {new Date(date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                      </option>
                    ))}
                  </select>
                </div>
                
                {selectedDate && (
                  <div className="mb-4">
                    <label className="block mb-1 font-medium">Horaires disponibles</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {getAvailableSlotsForDate().length === 0 ? (
                        <p className="text-gray-500 italic col-span-3">Aucun horaire disponible pour cette date.</p>
                      ) : (
                        getAvailableSlotsForDate().map(slot => (
                          <button
                            key={slot.id}
                            type="button"
                            onClick={() => handleSlotSelect(slot)}
                            className={`p-2 rounded border ${selectedSlot && selectedSlot.id === slot.id 
                              ? 'bg-blue-100 border-blue-400' 
                              : 'bg-white hover:bg-gray-50'}`}
                          >
                            {new Date(slot.start_time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                            {' - '}
                            {new Date(slot.end_time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
            
            {selectedSlot && (
              <div className="mt-4 p-3 bg-green-100 rounded-lg">
                <p className="font-medium text-green-800">
                  Vous avez sélectionné: {new Date(selectedSlot.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}, 
                  {' '}{new Date(selectedSlot.start_time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  {' - '}
                  {new Date(selectedSlot.end_time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium w-full md:w-auto"
            disabled={loading || !selectedSlot || !studentProfile}
          >
            {loading ? 'Création en cours...' : 'Réserver cette session'}
          </button>
        </form>
      )}
    </div>
  );
}
