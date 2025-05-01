import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaUser, FaCommentDots, FaCog, FaChevronDown } from 'react-icons/fa';
import axios from 'axios';

import Inbox from '../Inbox';

const Profile = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [openSessions, setOpenSessions] = useState({});

  useEffect(() => {
    axios.get('http://localhost:80/api/my-student', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(response => {
        setStudent(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erreur:', error);
        setLoading(false);
      });
  }, []);

  const toggleSession = (id) => {
    setOpenSessions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading) {
    return <div className="text-center py-10">Chargement...</div>;
  }

  if (!student || !student.user) {
    return <div className="text-center py-10">Aucun profil trouvé.</div>;
  }

  const upcomingSessions = []; // ممكن تجيبها من API مستقبلًا
  const pastSessions = [];

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Profile Sidebar */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <img src={student.image_url || 'https://via.placeholder.com/150'} alt={student.user.name} className="rounded-full h-24 w-24 mx-auto mb-4 object-cover" />
              <h2 className="text-xl font-semibold">{student.user.name}</h2>
              <p className="text-gray-500 text-sm">{student.user.email}</p>
            </div>
            <div className="mt-6 space-y-2 text-sm">
              <p><strong>Rôle :</strong> Étudiant</p>
              <p><strong>Université :</strong> {student.university || 'Non précisé'}</p>
              <p><strong>Niveau :</strong> {student.level}</p>
              <p><strong>Centres d’intérêt :</strong> {student.interests}</p>
              <p><strong>Membre depuis :</strong> {new Date(student.created_at).toLocaleDateString()}</p>
            </div>
            <Link to="/edit-profile" className="block mt-4 text-center bg-gray-200 py-2 rounded hover:bg-gray-300">
              <FaCog className="inline mr-2" />
              Modifier le profil
            </Link>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2">
            <div className="flex space-x-4 mb-6">
              <button
                className={`flex-1 p-3 rounded ${activeTab === 'upcoming' ? 'bg-blue-500 text-white' : 'bg-white border'}`}
                onClick={() => setActiveTab('upcoming')}
              >
                <FaCalendarAlt className="inline mr-2" /> Sessions à venir
              </button>
              <button
                className={`flex-1 p-3 rounded ${activeTab === 'past' ? 'bg-blue-500 text-white' : 'bg-white border'}`}
                onClick={() => setActiveTab('past')}
              >
                <FaUser className="inline mr-2" /> Sessions passées
              </button>
              <button
                className={`flex-1 p-3 rounded ${activeTab === 'messages' ? 'bg-blue-500 text-white' : 'bg-white border'}`}
                onClick={() => setActiveTab('messages')}
              >
                <FaCommentDots className="inline mr-2" /> Messages
              </button>
            </div>

            {/* Tabs Content */}
            <div className="bg-white rounded-lg shadow p-6">
              {activeTab === 'upcoming' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Sessions à venir</h3>
                  {upcomingSessions.length === 0 ? (
                    <p className="text-gray-500">Vous n'avez pas de sessions à venir.</p>
                  ) : (
                    upcomingSessions.map((session) => (
                      <div key={session.id} className="border rounded p-4 mb-3">
                        <h4 className="font-semibold">{session.topic}</h4>
                        <p className="text-sm text-gray-600">Avec {session.mentor}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          <FaCalendarAlt className="inline mr-1" />
                          {session.date} • {session.time}
                        </p>
                        <div className="mt-2 space-x-2">
                          <button className="px-3 py-1 border rounded text-sm">Reprogrammer</button>
                          <button className="px-3 py-1 border rounded text-sm bg-red-500 text-white">Annuler</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'past' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Sessions passées</h3>
                  {pastSessions.length === 0 ? (
                    <p className="text-gray-500">Aucune session passée pour le moment.</p>
                  ) : (
                    pastSessions.map((session) => (
                      <div key={session.id} className="border rounded mb-3">
                        <button
                          className="flex justify-between items-center w-full p-4 text-left"
                          onClick={() => toggleSession(session.id)}
                        >
                          <div>
                            <h4 className="font-semibold">{session.topic}</h4>
                            <p className="text-sm text-gray-500">Avec {session.mentor} • {session.date}</p>
                          </div>
                          <FaChevronDown
                            className={`transition-transform ${openSessions[session.id] ? 'rotate-180' : ''}`}
                          />
                        </button>
                        {openSessions[session.id] && (
                          <div className="p-4 border-t text-sm space-y-2">
                            <p><strong>Date :</strong> {session.date}</p>
                            <p><strong>Heure :</strong> {session.time}</p>
                            <p><strong>Sujet :</strong> {session.topic}</p>
                            <p><strong>Feedback :</strong></p>
                            <p className="italic">{session.feedback}</p>
                            <div className="flex justify-end">
                              <button className="px-3 py-1 border rounded text-sm">Contacter le mentor</button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'messages' && (
                <Inbox />
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
