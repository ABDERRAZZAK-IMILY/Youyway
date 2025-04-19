import registerImage from '../assets/register.png';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosClient } from "../api/axios.js";

export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: ''
    });
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!formData.password_confirmation) {
            newErrors.password_confirmation = 'Password confirmation is required';
        } else if (formData.password !== formData.password_confirmation) {
            newErrors.password_confirmation = 'Passwords do not match';
        }

        if (!formData.role) {
            newErrors.role = 'Role is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
        if (errors[e.target.id]) {
            setErrors({
                ...errors,
                [e.target.id]: ''
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            try {
                const response = await axiosClient.post('/register', formData);
                
                if (response.status === 200 || response.status === 201) {
                    console.log('Registration successful');
                    navigate('/login');
                } else {
                    setErrors({ submit: response.data.message || 'Registration failed' });
                }
            } catch (error) {
                setErrors({ 
                    submit: error.response?.data?.message || 'An error occurred. Please try again.' 
                });
            }
        }
    };

    return (
        <div className="flex h-screen ">
        {/* Left side - Image section */}
        <div className="hidden md:block md:w-1/2 bg-gray-100">
          <div className="h-full relative">
            <img 
              src={registerImage}
              alt="Student working on computer" 
              className="h-full w-full object-cover"
            />
          </div>
        </div>
  
        {/* Right side - Form section */}
        <div className="w-full md:w-1/2 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Create Your Account</h1>
            
            <form onSubmit={handleSubmit}>
             
  
              <div className="mb-6">
                <label className="block text-gray-700 mb-2" htmlFor="username">Name</label>
                <input 
                  id="name"
                  onChange={handleChange} 
                  value={formData.name}
                  className={`border ${errors.name ? 'border-red-500' : 'border-gray-300'} p-3 w-full rounded-md`}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
  
              <div className="mb-6">
                <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  onChange={handleChange} 
                  value={formData.email} 
                  className={`border ${errors.email ? 'border-red-500' : 'border-gray-300'} p-3 w-full rounded-md`}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
  
              <div className="flex gap-4 mb-8">
                <div className="w-1/2">
                  <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
                  <input 
                    id="password"  
                    type="password" 
                    onChange={handleChange} 
                    value={formData.password} 
                    className={`border ${errors.password ? 'border-red-500' : 'border-gray-300'} p-3 w-full rounded-md`}
                  />
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>
                <div className="w-1/2">
                  <label className="block text-gray-700 mb-2" htmlFor="confirmPassword">Confirm Password</label>
                  <input 
                    id="password_confirmation" 
                    type="password" 
                    onChange={handleChange} 
                    value={formData.password_confirmation} 
                    className={`border ${errors.password_confirmation ? 'border-red-500' : 'border-gray-300'} p-3 w-full rounded-md`}
                  />
                  {errors.password_confirmation && (
                    <p className="text-red-500 text-sm mt-1">{errors.password_confirmation}</p>
                )}
                </div>
              </div>
              <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="role">Role</label>
                        <select 
                            id="role" 
                            className={`border ${errors.role ? 'border-red-500' : 'border-gray-300'} p-2 w-full rounded`}
                            onChange={handleChange} 
                            value={formData.role}
                        >
                            <option value="Student">Student</option>
                            <option value="Mentor">Mentor</option> 
                            
                        </select>
                        {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
                    </div>
                    {errors.submit && <p className="text-red-500 text-sm mb-4">{errors.submit}</p>}
  
              <button 
                type="submit" 
                className="bg-gray-900 text-white py-3 px-4 rounded-md w-full flex items-center justify-center gap-2 hover:bg-black transition-colors"
              >
                Create Account 
              </button>
              
             
            </form>
          </div>
        </div>
      </div>
    );
}