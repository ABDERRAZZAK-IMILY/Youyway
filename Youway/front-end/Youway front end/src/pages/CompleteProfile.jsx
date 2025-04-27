import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { axiosClient } from '../api/axios';
import { jwtDecode } from 'jwt-decode';

export default function CompleteProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userId, setUserId] = useState(null);
  
  const [mentorForm, setMentorForm] = useState({
    user_id: '',
    bio: '',
    competences: '',
    disponibilites: '',
    domaine: '',
    university: ''
  });
  
  const [studentForm, setStudentForm] = useState({
    user_id: '',
    level: '',
    interests: '',
    school: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication token not found. Please log in again.');
      setLoading(false);
      return;
    }
    
    try {
      const decoded = jwtDecode(token);
      console.log('Decoded token:', decoded);
      
      const userId = decoded.sub;
      setUserId(userId);
      
      let role = decoded.role;
      
      if (!role) {
        console.log('Role not found in token, checking localStorage');
        role = localStorage.getItem('userRole');
      }
      
      if (!role) {
        console.log('Role not found in localStorage, fetching from API');
        axiosClient.get('/user')
          .then(response => {
            console.log('User details:', response.data);
            role = response.data.role;
            localStorage.setItem('userRole', role);
            setUserRole(role);
            
            if (role === 'Mentor') {
              setMentorForm(prev => ({ ...prev, user_id: userId }));
            } else if (role === 'Student') {
              setStudentForm(prev => ({ ...prev, user_id: userId }));
            }
            
            setLoading(false);
          })
          .catch(error => {
            console.error('Error fetching user details:', error);
            setError('Failed to get user role. Please contact an administrator.');
            setLoading(false);
          });
        return; 
      }
      
      setUserRole(role);
      localStorage.setItem('userRole', role);
      
      if (role === 'Mentor') {
        setMentorForm(prev => ({ ...prev, user_id: userId }));
      } else if (role === 'Student') {
        setStudentForm(prev => ({ ...prev, user_id: userId }));
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error decoding token:', err);
      setError('Invalid authentication token. Please log in again.');
      setLoading(false);
    }
  }, []);

  const handleMentorChange = (e) => {
    const { name, value } = e.target;
    setMentorForm(prev => ({ ...prev, [name]: value }));
  };

  const handleStudentChange = (e) => {
    const { name, value } = e.target;
    setStudentForm(prev => ({ ...prev, [name]: value }));
  };

  const handleMentorSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      console.log('Submitting mentor profile:', mentorForm);
      const response = await axiosClient.post('/mentors', mentorForm);
      
      console.log('Mentor profile created:', response.data);
      
      navigate('/mentor');
    } catch (err) {
      console.error('Error creating mentor profile:', err);
      setError(err.response?.data?.message || 'Failed to create mentor profile. Please try again.');
    }
  };

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      console.log('Submitting student profile:', studentForm);
      const response = await axiosClient.post('/students', studentForm);
      
      console.log('Student profile created:', response.data);
      
      navigate('/student');
    } catch (err) {
      console.error('Error creating student profile:', err);
      setError(err.response?.data?.message || 'Failed to create student profile. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Complete Your {userRole} Profile
        </h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {userRole === 'Mentor' ? (
          <form onSubmit={handleMentorSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="bio">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                rows="3"
                className="w-full p-2 border rounded"
                value={mentorForm.bio}
                onChange={handleMentorChange}
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="competences">
                Competences
              </label>
              <input
                type="text"
                id="competences"
                name="competences"
                className="w-full p-2 border rounded"
                value={mentorForm.competences}
                onChange={handleMentorChange}
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="disponibilites">
              disponibility
              </label>
              <input
                type="text"
                id="disponibilites"
                name="disponibilites"
                className="w-full p-2 border rounded"
                value={mentorForm.disponibilites}
                onChange={handleMentorChange}
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="domaine">
                Domain/Field
              </label>
              <input
                type="text"
                id="domaine"
                name="domaine"
                className="w-full p-2 border rounded"
                value={mentorForm.domaine}
                onChange={handleMentorChange}
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-2" htmlFor="university">
                University
              </label>
              <input
                type="text"
                id="university"
                name="university"
                className="w-full p-2 border rounded"
                value={mentorForm.university}
                onChange={handleMentorChange}
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Complete Profile
            </button>
          </form>
        ) : userRole === 'Student' ? (
          <form onSubmit={handleStudentSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="level">
                Education Level
              </label>
              <input
                type="text"
                id="level"
                name="level"
                className="w-full p-2 border rounded"
                value={studentForm.level}
                onChange={handleStudentChange}
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="interests">
                Interests
              </label>
              <input
                type="text"
                id="interests"
                name="interests"
                className="w-full p-2 border rounded"
                value={studentForm.interests}
                onChange={handleStudentChange}
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-2" htmlFor="school">
                School/University
              </label>
              <input
                type="text"
                id="school"
                name="school"
                className="w-full p-2 border rounded"
                value={studentForm.school}
                onChange={handleStudentChange}
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Complete Profile
            </button>
          </form>
        ) : (
          <div className="text-center text-gray-600">
            Unknown role. Please contact an administrator.
          </div>
        )}
      </div>
    </div>
  );
}