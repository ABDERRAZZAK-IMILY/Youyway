import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosClient } from "../api/axios.js";
import loginImage from "../assets/login.png";
import { jwtDecode } from "jwt-decode";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    if (errors[e.target.id]) {
      setErrors({ ...errors, [e.target.id]: "" });
    }
  };

  const generateDevToken = (email, role) => {
    // Create a simple header and payload
    const header = { alg: 'HS256', typ: 'JWT' };
    const payload = {
      sub: '123456',
      name: email.split('@')[0],
      email: email,
      role: role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour expiration
    };
    
    // Convert to base64
    const headerBase64 = btoa(JSON.stringify(header));
    const payloadBase64 = btoa(JSON.stringify(payload));
    
    // Add a fake signature (this is for DEVELOPMENT only)
    const signature = btoa('devSignature123');
    
    // Return proper JWT format: header.payload.signature
    return `${headerBase64}.${payloadBase64}.${signature}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    // DEVELOPMENT MODE: Use hardcoded credentials for testing
    // This bypasses the backend connection
    if (
      (formData.email === 'admin@youway.com' && formData.password === 'admin123') ||
      (formData.email === 'ahmed@gmail.com' && formData.password === 'imilyimily') ||
      (formData.email === 'mentor@gmail.com' && formData.password === 'imilyimily')
    ) {
      // Determine role based on email
      let role = 'student';
      if (formData.email === 'admin@youway.com') role = 'admin';
      if (formData.email === 'mentor@gmail.com') role = 'mentor';
      
      // Generate development token
      const token = generateDevToken(formData.email, role);
      
      // Create user object
      const user = {
        id: role === 'admin' ? 1 : (role === 'mentor' ? 2 : 3),
        email: formData.email,
        name: formData.email.split('@')[0],
        role: role,
        status: 'active'
      };
      
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      localStorage.setItem('userName', user.name);
      localStorage.setItem('userRole', role);
      
      // Navigate based on role
      console.log('Navigating based on role:', role);
      switch (role) {
        case 'student':
          navigate('/studentdashboard');
          break;
        case 'mentor':
          navigate('/mentordashboard'); 
          break;
        case 'admin':
          navigate('/admin-dashboard');
          break;
        default:
          navigate('/');
      }
      
      // Add a log to help with debugging
      console.log('Authentication successful:', { user, token: token.substring(0, 20) + '...' });
      return;
    }
    
    // PRODUCTION MODE: Use actual backend (only executes if dev credentials don't match)
    try {
      const response = await axiosClient.post("/login", formData);
      const { user, authorization } = response.data;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", authorization.token);
      localStorage.setItem("userName", user.name);
      localStorage.setItem("userRole", user.role.toLowerCase());
      switch (user.role.toLowerCase()) {
        case "student":
          navigate("/studentdashboard");
          break;
        case "mentor":
          navigate("/mentordashboard"); 
          break;
        case "admin":
          navigate("/admin-dashboard");
          break;
        default:
          navigate("/");
      }
    } catch (error) {
      setErrors({ server: error.response?.data?.message || "Login failed. Please check your credentials." });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 mt-10">
      <div className="flex bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-4xl">
        {/* Left form section */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Sign in to your account
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="text"
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Username or Email ID"
                className={`w-full px-4 py-2 border ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter Password"
                className={`w-full px-4 py-2 border ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>
            {errors.server && (
              <div className="text-red-500 text-sm mb-4 text-center">{errors.server}</div>
            )}
            <button
              type="submit"
              className="w-full bg-indigo-900 text-white py-2 rounded-lg flex items-center justify-center hover:bg-indigo-800 transition-colors"
            >
              Sign In
            </button>
          </form>
        </div>
        {/* Right image section */}
        <div className="hidden md:block md:w-1/2">
          <img
            src={loginImage}
            alt="Login"
            className="object-cover h-full w-full"
          />
        </div>
      </div>
    </div>
  );
}
