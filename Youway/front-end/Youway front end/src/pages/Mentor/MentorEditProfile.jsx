import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MentorEditProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mentorId, setMentorId] = useState(null);
  const [form, setForm] = useState({
    domaine: '',
    university: '',
    years_experience: '',
    competences: '',
    bio: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get('http://localhost:80/api/my-mentor', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });

        console.log('Fetched mentor profile:', data);
        console.log('Available properties:', Object.keys(data));
        
        console.log('Domaine:', data.domaine);
        console.log('Université:', data.university);
        console.log('Expérience:', data.years_experience);
        console.log('Compétences:', data.competences);
        
        setMentorId(data.id);
        setForm({
          domaine: data.domaine || '',
          university: data.university || '',
          years_experience: data.years_experience || '',
          competences: data.competences || '',
          bio: data.bio || '',
          image: null
        });

        if (data.image_path) {
          setImagePreview(`http://localhost/storage/${data.image_path}`);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err.response?.data?.message || 'Error fetching profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm(prev => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('domaine', form.domaine);
      formData.append('university', form.university);
      formData.append('years_experience', form.years_experience);
      formData.append('competences', form.competences);
      formData.append('bio', form.bio);
      if (form.image) {
        formData.append('image', form.image);
      }
      formData.append('_method', 'PUT');

      if (!mentorId) {
        throw new Error('Mentor ID not found');
      }

      await axios.post(
        `http://localhost:80/api/mentors/${mentorId}`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          }
        }
      );

      navigate('/mentor-profile');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-xl text-gray-600">Loading...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto bg-white shadow p-6">
        <h2 className="text-2xl font-semibold mb-6">Modifier le profil</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Profile Image */}
          <div className="mb-6 text-center">
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="h-32 w-32 object-cover rounded-full mx-auto mb-4"
              />
            )}
            <label className="inline-block px-4 py-2 bg-gray-200 text-gray-700 cursor-pointer hover:bg-gray-300">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              Changer la photo
            </label>
          </div>

          {/* Domaine Field - Required */}
          <div className="border-t pt-4">
            <h3 className="font-semibold text-md mb-4">Informations du Mentor</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Domaine <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="domaine"
                value={form.domaine}
                onChange={handleChange}
                className="w-full p-2 border focus:ring-2 focus:ring-green-500"
                placeholder="ex: Informatique, Mathématiques, Ingénierie"
                required
              />
            </div>
          </div>

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Université <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="university"
              value={form.university}
              onChange={handleChange}
              className="w-full p-2 border focus:ring-2 focus:ring-green-500"
              placeholder="ex: Université de Paris, EPFL, etc."
              required
            />

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expérience <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center">
              <input
                type="number"
                name="years_experience"
                value={form.years_experience}
                onChange={handleChange}
                min="0"
                className="w-full p-2 border focus:ring-2 focus:ring-green-500"
                placeholder="Nombre d'années"
                required
              />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Compétences
            </label>
            <textarea
              name="competences"
              value={form.competences}
              onChange={handleChange}
              rows="3"
              className="w-full p-2 border focus:ring-2 focus:ring-green-500"
              placeholder="Séparez les compétences par des virgules (ex: Java, Python, Machine Learning)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Biographie
            </label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows="4"
              className="w-full p-2 border focus:ring-2 focus:ring-green-500"
              placeholder="Parlez de vous, de votre parcours et de votre expertise..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t mt-6">
            <button
              type="button"
              onClick={() => navigate('/mentor-profile')}
              className="px-4 py-2 border hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MentorEditProfile;
