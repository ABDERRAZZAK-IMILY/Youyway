import React from 'react';
import { Link } from 'react-router-dom';
import { FiPlusCircle, FiFileText, FiBookOpen, FiUsers, FiBarChart2, FiCalendar } from 'react-icons/fi';

const MentorDashboard = () => {
 
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
            <h3 className="text-xl font-bold">3</h3>
          </div>
        </div>
        <div className="flex items-center p-4 bg-white rounded shadow">
          <FiCalendar className="text-purple-500 mr-4 h-6 w-6" />
          <div>
            <p className="text-sm text-gray-500">Sessions</p>
            <h3 className="text-xl font-bold">2</h3>
          </div>
        </div>
      </div>

    </div>
  );
};

export default MentorDashboard;
