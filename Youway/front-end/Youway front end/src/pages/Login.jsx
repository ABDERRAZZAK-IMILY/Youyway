import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosClient } from "../api/axios.js";
import loginImage from "../assets/login.png";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

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
