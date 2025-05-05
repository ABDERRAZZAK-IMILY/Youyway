import React from 'react';
import { Link } from 'react-router-dom';
import { FiPlusCircle, FiFileText, FiBookOpen, FiUsers, FiBarChart2, FiCalendar } from 'react-icons/fi';

const MentorDashboard = () => {
  const courses = [
    { id: '1', title: 'React et Node.js', students: 158, revenue: 67500, status: 'published' },
    { id: '2', title: 'Intelligence Artificielle', students: 87, revenue: 34800, status: 'published' },
    { id: '3', title: 'Cybersécurité', students: 0, revenue: 0, status: 'draft' },
  ];

  const upcomingSessions = [
    { id: '1', student: 'Amal', subject: 'React', date: '2 Mai 2025', time: '14:00' },
    { id: '2', student: 'Youssef', subject: 'ML', date: '5 Mai 2025', time: '16:30' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Tableau de bord mentor</h1>
          <p className="text-gray-600">Gérez vos cours et sessions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="flex items-center p-4 bg-white rounded shadow">
          <FiUsers className="text-orange-500 mr-4 h-6 w-6" />
          <div>
            <p className="text-sm text-gray-500">Étudiants</p>
            <h3 className="text-xl font-bold">{courses.reduce((sum, c) => sum + c.students, 0)}</h3>
          </div>
        </div>
        <div className="flex items-center p-4 bg-white rounded shadow">
          <FiCalendar className="text-purple-500 mr-4 h-6 w-6" />
          <div>
            <p className="text-sm text-gray-500">Sessions</p>
            <h3 className="text-xl font-bold">{upcomingSessions.length}</h3>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">Sessions à venir</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left bg-white rounded shadow">
          <thead>
            <tr className="border-b">
              <th className="p-3">Étudiant</th>
              <th className="p-3">Sujet</th>
              <th className="p-3">Date</th>
              <th className="p-3">Heure</th>
            </tr>
          </thead>
          <tbody>
            {upcomingSessions.map(s => (
              <tr key={s.id} className="border-b">
                <td className="p-3">{s.student}</td>
                <td className="p-3">{s.subject}</td>
                <td className="p-3">{s.date}</td>
                <td className="p-3">{s.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MentorDashboard;
