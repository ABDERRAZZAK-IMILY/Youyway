import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import MentorSidebar from './MentorSidebar';
import StudentSidebar from './StudentSidebar';
import AdminSidebar from './AdminSidebar';
import Header from './Header';
import { Outlet, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';


export default function DashboardLayout() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const storedRole = localStorage.getItem('userRole');
        
        console.log('Checking auth in DashboardLayout, Token exists:', !!token);
        console.log('User data:', user);
        console.log('Stored role:', storedRole);
        
        if (!token || !user) {
          console.log('No token or user data, redirecting to login');
          navigate('/login');
          return;
        }

        let role = storedRole;
        if (!role && token) {
          try {
            const decoded = jwtDecode(token);
            role = decoded.role;
            console.log('Role from JWT:', role);
          } catch (error) {
            console.error('Error decoding token:', error);
          }
        }

        if (!role && user.role) {
          role = user.role;
          console.log('Role from user object:', role);
        }
     
        if (role) {
          role = role.toLowerCase();
        }
        
        console.log('Final determined role:', role);
        setUserRole(role);
        setAuthenticated(true);
      } catch (err) {
        console.error('Auth error:', err);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }
  
  if (!authenticated) {
    return null;
  }

  const renderSidebar = () => {
    console.log('Rendering sidebar for role:', userRole);
    
    const role = userRole ? userRole.toLowerCase() : null;
    
    switch (role) {
      case 'admin':
        return <AdminSidebar />;
      case 'mentor':
        return <MentorSidebar />;
      case 'student':
        return <StudentSidebar />;
      default:
        console.log('No recognized role, using default sidebar');
        return <Sidebar />;
    }
  };
  
  return (
    <div className="flex h-screen overflow-hidden">
      {renderSidebar()}
      <div className="flex-1 flex flex-col overflow-auto">
        <Header />
        <main className="p-6 bg-gray-50 flex-1 overflow-auto">
        <Outlet />
        </main>
      </div>
    </div>
  );
}
