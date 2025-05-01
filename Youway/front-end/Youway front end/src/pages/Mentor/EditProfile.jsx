import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
  const [student, setStudent] = useState(null);
  const [form, setForm] = useState({
    interests: '',
    university: '',
    level: '',
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:80/api/my-student', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(({ data }) => {
      setStudent(data);
      setForm({
        interests: data.interests || '',
        university: data.university || '',
        level: data.level || '',
        image: null,
      });
      if (data.image_path) {
        setImagePreview(`http://localhost/storage/${data.image_path}`);
      }
    })
    .catch(err => console.error(err))
    .finally(() => setLoading(false));
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleImageChange = e => {
    const file = e.target.files[0];
    setForm(f => ({ ...f, image: file }));
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('interests', form.interests);
    formData.append('university', form.university);
    formData.append('level', form.level);
    if (form.image) formData.append('image', form.image);

    axios.put(
      `http://localhost:80/api/student/${student.id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        }
      }
    )
    .then(() => {
      alert('Profile updated successfully');
      navigate('/profile');
    })
    .catch(err => {
      console.error('Error updating profile:', err);
      alert('Error updating profile');
    });
  };

  if (loading) return <div>Loading...</div>;
  if (!student) return <div>No profile found.</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-lg">
        {['interests','university','level'].map(field => (
          <div key={field} className="mb-4">
            <label htmlFor={field} className="block text-sm font-medium text-gray-700">
              {field.charAt(0).toUpperCase()+field.slice(1)}
            </label>
            <input
              id={field}
              name={field}
              type="text"
              value={form[field]}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>
        ))}

        <div className="mb-4">
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">
            Profile Image
          </label>
          <input
            id="image"
            name="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-1"
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Profile Preview"
              className="mt-2 h-32 w-32 object-cover rounded-full"
            />
          )}
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
