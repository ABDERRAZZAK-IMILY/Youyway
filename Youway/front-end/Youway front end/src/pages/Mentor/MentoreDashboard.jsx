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
        <div className="flex gap-3">
          <Link to="/create-course" className="flex items-center px-3 py-2 bg-green-500 text-white rounded">
            <FiPlusCircle className="mr-2 h-5 w-5" /> Créer un cours
          </Link>
          <Link to="/create-quiz" className="flex items-center px-3 py-2 border rounded">
            <FiFileText className="mr-2 h-5 w-5" /> Créer un quiz
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="flex items-center p-4 bg-white rounded shadow">
          <FiBookOpen className="text-blue-500 mr-4 h-6 w-6" />
          <div>
            <p className="text-sm text-gray-500">Cours publiés</p>
            <h3 className="text-xl font-bold">{courses.filter(c => c.status === 'published').length}</h3>
          </div>
        </div>
        <div className="flex items-center p-4 bg-white rounded shadow">
          <FiUsers className="text-orange-500 mr-4 h-6 w-6" />
          <div>
            <p className="text-sm text-gray-500">Étudiants</p>
            <h3 className="text-xl font-bold">{courses.reduce((sum, c) => sum + c.students, 0)}</h3>
          </div>
        </div>
        <div className="flex items-center p-4 bg-white rounded shadow">
          <FiBarChart2 className="text-green-500 mr-4 h-6 w-6" />
          <div>
            <p className="text-sm text-gray-500">Revenus</p>
            <h3 className="text-xl font-bold">
              {courses.reduce((sum, c) => sum + c.revenue, 0)} MAD
            </h3>
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

      <h2 className="text-2xl font-bold mb-4">Mes Cours</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {courses.map(c => (
          <div key={c.id} className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold text-lg mb-1">{c.title}</h3>
            <p className="text-sm text-gray-500">{c.students} étudiants</p>
            <p className="text-sm text-gray-500">Revenu: {c.revenue} MAD</p>
            <div className="mt-3 flex gap-2">
              <Link to={`/course/${c.id}`} className="text-blue-600 text-sm">Voir</Link>
              <Link to={`/edit-course/${c.id}`} className="text-gray-600 text-sm">Modifier</Link>
            </div>
          </div>
        ))}
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
