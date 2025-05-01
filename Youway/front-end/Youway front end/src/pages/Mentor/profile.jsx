import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaUser, FaCommentDots, FaCog, FaChevronDown } from 'react-icons/fa';

import Inbox from '../Inbox';

const Profile = () => {
  const userData = {
    name: 'Leo Messi',
    email: 'messi@gmail.com',
    role: 'Étudiant',
    university: 'Université Mohammed V',
    field: 'Informatique',
    bio: 'Étudiant en informatique passionné par le développement web et le machine learning. À la recherche de conseils pour développer ma carrière dans le domaine de la tech.',
    imageUrl: 'http://localhost/storage/session_images/JBkyUx2ni48SKfoSOn0yGq5PWd00VkfapgE4kLSJ.png',
    joinDate: 'Avril 2023',
  };

  const upcomingSessions = [
    {
      id: '1',
      mentor: 'Sara Alaoui',
      date: '15 Mai 2025',
      time: '14:00 - 15:00',
      title: 'Orientation professionnelle en développement web',
    },
    {
      id: '2',
      mentor: 'Mohamed Charkaoui',
      date: '22 Mai 2025',
      time: '10:00 - 11:00',
      topic: 'Préparation au marché du travail',
    },
  ];

  const pastSessions = [
    {
      id: '3',
      mentor: 'Fatima Zahra Kadiri',
      date: '1 Avril 2025',
      time: '15:00 - 16:00',
      topic: "Introduction à l'intelligence artificielle",
      feedback: 'Session très enrichissante, merci pour vos conseils !',
    },
    {
      id: '4',
      mentor: 'Karim Idrissi',
      date: '15 Mars 2025',
      time: '11:00 - 12:00',
      topic: 'Stratégies de recherche de stage',
      feedback: "Conseils très pratiques, j'ai déjà commencé à les appliquer.",
    },
  ];

  const [activeTab, setActiveTab] = useState('upcoming');
  const [openSessions, setOpenSessions] = useState({});

  const toggleSession = (id) => {
    setOpenSessions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Profile Sidebar */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <img src={userData.imageUrl} alt={userData.name} className="rounded-full h-24 w-24 mx-auto mb-4 object-cover" />
              <h2 className="text-xl font-semibold">{userData.name}</h2>
              <p className="text-gray-500 text-sm">{userData.email}</p>
            </div>
            <div className="mt-6 space-y-2 text-sm">
              <p><strong>Rôle :</strong> {userData.role}</p>
              <p><strong>Université :</strong> {userData.university}</p>
              <p><strong>Domaine :</strong> {userData.field}</p>
              <p><strong>Bio :</strong> {userData.bio}</p>
              <p><strong>Membre depuis :</strong> {userData.joinDate}</p>
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
                  {pastSessions.map((session) => (
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
                  ))}
                </div>
              )}

              {activeTab === 'messages' && (
               <Inbox/>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
