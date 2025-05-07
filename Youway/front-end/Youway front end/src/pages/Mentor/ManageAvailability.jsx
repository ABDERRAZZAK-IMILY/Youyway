import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { axiosClient } from '../../api/axios';
import { FaTrash, FaPlus, FaCalendarAlt } from 'react-icons/fa';

const ManageAvailability = () => {
  const navigate = useNavigate();
  const [availabilities, setAvailabilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mentorId, setMentorId] = useState(null);

  const [newAvailability, setNewAvailability] = useState({
    date: '',
    start_time: '',
    end_time: ''
  });

  useEffect(() => {
    const fetchMentorData = async () => {
      try {
        const { data: mentorData } = await axiosClient.get('/my-mentor');
        console.log('Mentor data retrieved:', mentorData);
        setMentorId(mentorData.id);
        
        const { data: availabilityData } = await axiosClient.get(`/mentor-availability/${mentorData.id}`);
        
        console.log('Availability data retrieved:', availabilityData);
        setAvailabilities(Array.isArray(availabilityData) ? availabilityData : []);
      } catch (err) {
        console.error('Error fetching mentor data:', err);
        setError(err.response?.data?.message || 'An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchMentorData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAvailability({
      ...newAvailability,
      [name]: value
    });
  };

  const addAvailability = async (e) => {
    e.preventDefault();
    
    if (!newAvailability.date || !newAvailability.start_time || !newAvailability.end_time) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      
      const dateStr = newAvailability.date;
      const startTimeStr = `${dateStr}T${newAvailability.start_time}:00`;
      const endTimeStr = `${dateStr}T${newAvailability.end_time}:00`;
      
      const startDateTime = new Date(startTimeStr);
      const endDateTime = new Date(endTimeStr);
      
      if (startDateTime >= endDateTime) {
        setError('End time must be after start time');
        setLoading(false);
        return;
      }
      
      console.log('Adding availability with data:', {
        mentor_id: mentorId,
        date: dateStr,
        start_time: startTimeStr,
        end_time: endTimeStr
      });
      
      const availabilityData = {
        mentor_id: mentorId,
        date: dateStr,
        start_time: startTimeStr,
        end_time: endTimeStr
      };

      const { data } = await axiosClient.post(
        '/mentor-availability',
        availabilityData
      );

      setAvailabilities([...availabilities, data]);
      
      setNewAvailability({
        date: '',
        start_time: '',
        end_time: ''
      });
      
      setError(null);
    } catch (err) {
      console.error('Error adding availability:', err);
      if (err.response) {
        console.error('Error response data:', err.response.data);
        console.error('Error response status:', err.response.status);
        
        if (err.response.data && err.response.data.errors) {
          const errorMessages = Object.values(err.response.data.errors)
            .flat()
            .join(', ');
          setError(`Validation error: ${errorMessages}`);
        } else {
          setError(err.response?.data?.message || 'Failed to add availability');
        }
      } else {
        setError('Network error or server not responding');
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteAvailability = async (id) => {
    try {
      setLoading(true);
      
      await axiosClient.delete(`/mentor-availability/${id}`);

      setAvailabilities(availabilities.filter(item => item.id !== id));
    } catch (err) {
      console.error('Error deleting availability:', err);
      setError(err.response?.data?.message || 'Failed to delete availability');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Date invalide';
    }
  };

  const formatTime = (timeString) => {
    try {
      return new Date(timeString).toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting time:', error);
      return 'Heure invalide';
    }
  };

  if (loading && availabilities.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            <FaCalendarAlt className="mr-2 text-green-600" />
            Gérer votre disponibilité
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={addAvailability} className="mb-8 border-b pb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={newAvailability.date}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Heure de début
                </label>
                <input
                  type="time"
                  name="start_time"
                  value={newAvailability.start_time}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Heure de fin
                </label>
                <input
                  type="time"
                  name="end_time"
                  value={newAvailability.end_time}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 flex items-center"
            >
              <FaPlus className="mr-2" />
              {loading ? 'Ajout en cours...' : 'Ajouter disponibilité'}
            </button>
          </form>

          <h3 className="text-xl font-semibold mb-4">Vos disponibilités</h3>
          
          {availabilities.length === 0 ? (
            <p className="text-gray-500 italic">Vous n'avez pas encore ajouté de disponibilités.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="py-2 px-4 text-left">Date</th>
                    <th className="py-2 px-4 text-left">Début</th>
                    <th className="py-2 px-4 text-left">Fin</th>
                    <th className="py-2 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {availabilities.map((item) => (
                    <tr key={item.id} className="border-t hover:bg-gray-50">
                      <td className="py-3 px-4">{formatDate(item.date)}</td>
                      <td className="py-3 px-4">{formatTime(item.start_time)}</td>
                      <td className="py-3 px-4">{formatTime(item.end_time)}</td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => deleteAvailability(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        <div className="flex justify-between">
          <button
            onClick={() => navigate('/mentor-profile')}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Retour au profil
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageAvailability;
