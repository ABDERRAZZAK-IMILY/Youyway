import React, { useState, useEffect } from 'react';
import { axiosClient } from '../../api/axios';
import { FaCalendarCheck, FaUserGraduate, FaBookOpen, FaClipboardList } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  const [stats, setStats] = useState({
    totalSessions: 0,
    completedSessions: 0,
    upcomingSessions: 0
  });
  const [recentSessions, setRecentSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setUserData(user);
        }
        
        const { data } = await axiosClient.get('/sessions');
        
        const studentSessions = Array.isArray(data) ? data.filter(session => 
          session.student_id === userData?.id
        ) : [];
        
        const currentDate = new Date();
        
        const completed = studentSessions.filter(session => 
          new Date(session.end_time) < currentDate
        ).length;
        
        const upcoming = studentSessions.filter(session => 
          new Date(session.start_time) > currentDate
        ).length;
        
        setStats({
          totalSessions: studentSessions.length,
          completedSessions: completed,
          upcomingSessions: upcoming
        });
        
        const sortedSessions = [...studentSessions].sort((a, b) => 
          new Date(b.start_time) - new Date(a.start_time)
        );
        
        setRecentSessions(sortedSessions.slice(0, 5));
        
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [userData?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 text-xl">{error}</div>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Student Dashboard</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold">
          Welcome back, {userData?.name || 'Student'}!
        </h2>
        <p className="text-gray-600 mt-2">
          Here's an overview of your mentoring journey.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-blue-100 rounded-lg shadow p-6 flex items-center">
          <div className="rounded-full bg-blue-200 p-3 mr-4">
            <FaCalendarCheck className="text-blue-700 text-xl" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-blue-700">Total Sessions</h3>
            <p className="text-2xl font-bold text-blue-900">{stats.totalSessions}</p>
          </div>
        </div>
        
        <div className="bg-green-100 rounded-lg shadow p-6 flex items-center">
          <div className="rounded-full bg-green-200 p-3 mr-4">
            <FaClipboardList className="text-green-700 text-xl" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-green-700">Completed</h3>
            <p className="text-2xl font-bold text-green-900">{stats.completedSessions}</p>
          </div>
        </div>
        
        <div className="bg-purple-100 rounded-lg shadow p-6 flex items-center">
          <div className="rounded-full bg-purple-200 p-3 mr-4">
            <FaBookOpen className="text-purple-700 text-xl" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-purple-700">Upcoming</h3>
            <p className="text-2xl font-bold text-purple-900">{stats.upcomingSessions}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link 
            to="/mentores" 
            className="bg-blue-500 text-white py-3 px-4 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors"
          >
            <FaUserGraduate className="mr-2" />
            Find Mentors
          </Link>
          
          <Link 
            to="/book-session" 
            className="bg-green-500 text-white py-3 px-4 rounded-lg flex items-center justify-center hover:bg-green-600 transition-colors"
          >
            <FaCalendarCheck className="mr-2" />
            Book Session
          </Link>
          
          <Link 
            to="/inbox" 
            className="bg-purple-500 text-white py-3 px-4 rounded-lg flex items-center justify-center hover:bg-purple-600 transition-colors"
          >
            <FaClipboardList className="mr-2" />
            Messages
          </Link>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Sessions</h2>
        
        {recentSessions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mentor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentSessions.map((session) => {
                  const sessionDate = new Date(session.start_time);
                  const currentDate = new Date();
                  const isPast = sessionDate < currentDate;
                  
                  return (
                    <tr key={session.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{session.mentor_name || 'Unknown Mentor'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(session.start_time).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(session.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          isPast ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {isPast ? 'Completed' : 'Upcoming'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            No sessions found. Book your first session with a mentor!
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
