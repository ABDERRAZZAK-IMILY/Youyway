import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaSave, FaArrowLeft } from 'react-icons/fa';

const EditProfile = () => {
  const [student, setStudent] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:80/api/my-student', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(response => {
        setStudent(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching profile:', error);
        setLoading(false);
      });
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('user_id', student.user.id);
    formData.append('bio', student.bio || '');
    formData.append('competences', student.competences || '');
    formData.append('disponibilites', student.disponibilites || '');
    formData.append('domaine', student.domaine || '');
    formData.append('university', student.university || '');
    
    if (image) {
      formData.append('image', image);
    }

    axios.put(`http://localhost:80/api/students/${student.id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(response => {
        navigate(`/profile`);
      })
      .catch(error => {
        if (error.response && error.response.data.errors) {
          setErrors(error.response.data.errors);
        }
        console.error('Error updating profile:', error);
      });
  };

  if (loading) {
    return <div className="text-center py-10">Chargement...</div>;
  }

  if (!student) {
    return <div className="text-center py-10">Aucun profil trouvé.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => navigate('/profile')} className="text-gray-500 hover:text-gray-700">
            <FaArrowLeft className="inline mr-2" /> Retour
          </button>
          <h2 className="text-2xl font-semibold">Modifier le Profil</h2>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name and Email */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-600">Nom</label>
              <input
                id="name"
                type="text"
                value={student.user.name}
                disabled
                className="w-full mt-1 p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-600">Email</label>
              <input
                id="email"
                type="email"
                value={student.user.email}
                disabled
                className="w-full mt-1 p-2 border border-gray-300 rounded"
              />
            </div>

            {/* Bio */}
            <div className="col-span-2">
              <label htmlFor="bio" className="block text-sm font-medium text-gray-600">Bio</label>
              <textarea
                id="bio"
                value={student.bio || ''}
                onChange={(e) => setStudent({ ...student, bio: e.target.value })}
                className="w-full mt-1 p-2 border border-gray-300 rounded"
              ></textarea>
              {errors.bio && <p className="text-red-500 text-sm">{errors.bio[0]}</p>}
            </div>

            {/* Competences */}
            <div className="col-span-2">
              <label htmlFor="competences" className="block text-sm font-medium text-gray-600">Compétences</label>
              <textarea
                id="competences"
                value={student.competences || ''}
                onChange={(e) => setStudent({ ...student, competences: e.target.value })}
                className="w-full mt-1 p-2 border border-gray-300 rounded"
              ></textarea>
              {errors.competences && <p className="text-red-500 text-sm">{errors.competences[0]}</p>}
            </div>

            {/* University */}
            <div>
              <label htmlFor="university" className="block text-sm font-medium text-gray-600">Université</label>
              <input
                id="university"
                type="text"
                value={student.university || ''}
                onChange={(e) => setStudent({ ...student, university: e.target.value })}
                className="w-full mt-1 p-2 border border-gray-300 rounded"
              />
            </div>

            {/* Profile Image */}
            <div className="col-span-2">
              <label htmlFor="image" className="block text-sm font-medium text-gray-600">Image de Profil</label>
              <input
                id="image"
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                className="w-full mt-1 p-2 border border-gray-300 rounded"
              />
              {errors.image && <p className="text-red-500 text-sm">{errors.image[0]}</p>}
            </div>

            {/* Submit Button */}
            <div className="col-span-2 text-right">
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600"
              >
                <FaSave className="inline mr-2" /> Sauvegarder les modifications
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
