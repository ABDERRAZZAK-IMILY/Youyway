import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaUser, FaCommentDots, FaCog, FaChevronDown, FaStar, FaGraduationCap, FaBriefcase, FaClock, FaMoneyBillWave } from 'react-icons/fa';
import axios from 'axios';

import Inbox from '../Inbox';

const MentorProfile = () => {
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [openSessions, setOpenSessions] = useState({});
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [pastSessions, setPastSessions] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: mentorData } = await axios.get('http://localhost:80/api/my-mentor', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setMentor(mentorData);
        console.log('Mentor data loaded:', mentorData);

        if (mentorData && mentorData.id) {
          try {
            const { data: reviewsData } = await axios.get(`http://localhost:80/api/mentors/${mentorData.id}/reviews`, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setReviews(reviewsData);
            console.log('Mentor reviews loaded:', reviewsData);
          } catch (reviewErr) {
            console.error('Error fetching reviews:', reviewErr);
          } finally {
            setReviewsLoading(false);
          }
        }

        const { data: sessionsData } = await axios.get('http://localhost:80/api/sessions', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        console.log('All sessions:', sessionsData);

        const mentorSessions = sessionsData.filter(session => {
          return session && session.mentor_id && session.mentor_id === mentorData.id;
        });

        console.log('Filtered mentor sessions:', mentorSessions);
        
        const now = new Date();
        const upcomingSessions = mentorSessions.filter(s => 
          s && s.start_time && new Date(s.start_time) >= now
        ) || [];
        
        const pastSessions = mentorSessions.filter(s => 
          s && s.start_time && new Date(s.start_time) < now
        ) || [];
        
        setUpcomingSessions(upcomingSessions);
        setPastSessions(pastSessions);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.response?.data?.message || 'An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleSession = (id) => {
    setOpenSessions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating || 0);
    const remainder = rating - fullStars;
    let stars = [];
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-yellow-500" />);
    }
    
    if (remainder >= 0.5) {
      stars.push(<FaStar key="half" className="text-yellow-500" />);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="text-gray-300" />);
    }
    
    return <div className="flex">{stars}</div>;
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-xl text-gray-600">Loading...</div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-xl text-red-600">{error}</div>
    </div>
  );

  if (!mentor) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-xl text-gray-600">No profile found</div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="w-full px-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div className="bg-white shadow p-6">
            <div className="text-center">
              <img
                src={
                  mentor.image_path
                    ? `http://localhost/storage/${mentor.image_path}`
                    : 'https://via.placeholder.com/150'
                }
                alt={mentor.user?.name || 'Mentor Profile'}
                className="rounded-full h-24 w-24 mx-auto mb-4 object-cover"
              />
              <h2 className="text-xl font-semibold">{mentor.user?.name || 'Unknown'}</h2>
              <p className="text-gray-500 text-sm">
                {mentor.user?.email || 'No email available'}
              </p>
              <div className="flex justify-center items-center mt-2">
                {renderStars(mentor.rating)}
                <span className="ml-1 text-sm text-gray-600">
                  {mentor.rating ? mentor.rating.toFixed(1) : 'No ratings'}
                </span>
              </div>
              <Link 
                to="/mentor-edit-profile" 
                className="mt-4 inline-block px-4 py-2 bg-green-600 text-white font-medium text-sm hover:bg-green-700 transition-colors"
              >
                Modifier le profil
              </Link>
            </div>

            <div className="mt-6 border-t pt-6">
              <h3 className="font-semibold text-lg mb-3">Informations du Mentor</h3>
              
              <div className="flex items-start mb-3">
                <FaBriefcase className="text-green-600 mt-1 mr-3" />
                <div>
                  <h4 className="font-medium text-sm">Domaine</h4>
                  <p className="text-gray-700">{mentor.domaine || 'Non spécifié'}</p>
                </div>
              </div>
              
              <div className="flex items-start mb-3">
                <FaGraduationCap className="text-green-600 mt-1 mr-3" />
                <div>
                  <h4 className="font-medium text-sm">Université</h4>
                  <p className="text-gray-700">{mentor.university || 'Non spécifié'}</p>
                </div>
              </div>
              
              <div className="flex items-start mb-3">
                <FaClock className="text-green-600 mt-1 mr-3" />
                <div>
                  <h4 className="font-medium text-sm">Expérience</h4>
                  <p className="text-gray-700">
                    {mentor.years_experience ? `${mentor.years_experience} ans` : 'Non spécifié'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 border-t pt-4">
              <h3 className="font-semibold text-lg mb-3">Compétences</h3>
              <div className="flex flex-wrap gap-2">
                {mentor.competences ? 
                  mentor.competences.split(',').map((comp, index) => (
                    <span key={index} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      {comp.trim()}
                    </span>
                  )) : 
                  <p className="text-gray-500">Aucune compétence spécifiée</p>
                }
              </div>
            </div>
            
            <div className="mt-4 border-t pt-4">
              <h3 className="font-semibold text-lg mb-3">Biographie</h3>
              <p className="text-gray-700 text-sm">{mentor.bio || 'Aucune biographie disponible.'}</p>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="bg-white shadow h-full">
              <div className="flex border-b overflow-x-auto sticky top-0 bg-white z-10">
                <button
                  className={`py-3 px-4 font-medium text-sm ${
                    activeTab === 'upcoming' ? 'border-b-2 border-green-500 text-green-600' : 'text-gray-500'
                  }`}
                  onClick={() => setActiveTab('upcoming')}
                >
                  Sessions à venir
                </button>
                <button
                  className={`py-3 px-4 font-medium text-sm ${
                    activeTab === 'past' ? 'border-b-2 border-green-500 text-green-600' : 'text-gray-500'
                  }`}
                  onClick={() => setActiveTab('past')}
                >
                  Sessions passées
                </button>
                <button
                  className={`py-3 px-4 font-medium text-sm ${
                    activeTab === 'reviews' ? 'border-b-2 border-green-500 text-green-600' : 'text-gray-500'
                  }`}
                  onClick={() => setActiveTab('reviews')}
                >
                  Avis
                </button>
                <button
                  className={`py-3 px-4 font-medium text-sm ${
                    activeTab === 'messages' ? 'border-b-2 border-green-500 text-green-600' : 'text-gray-500'
                  }`}
                  onClick={() => setActiveTab('messages')}
                >
                  Messages
                </button>
              </div>

              <div className="p-4">
                {activeTab === 'upcoming' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Sessions à venir</h3>
                    {upcomingSessions.length === 0 ? (
                      <p className="text-gray-500">Vous n'avez pas de sessions à venir.</p>
                    ) : (
                      upcomingSessions.map((session) => (
                        <div key={session.id} className="border rounded p-4 mb-3">
                          <h4 className="font-semibold">{session.topic}</h4>
                          <p className="text-sm text-gray-600">Avec {session.student?.user?.name || 'Unknown Student'}</p>
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
                      <div className="grid grid-cols-1 gap-3">
                        {pastSessions.map((session) => (
                          <div key={session.id} className="border">
                            <button
                              className="flex justify-between items-center w-full p-4 text-left"
                              onClick={() => toggleSession(session.id)}
                            >
                              <div>
                                <h4 className="font-semibold">{session.topic}</h4>
                                <p className="text-sm text-gray-500">Avec {session.student?.user?.name || 'Unknown Student'} • {session.date || 'No date'}</p>
                              </div>
                              <FaChevronDown className={`transition-transform ${openSessions[session.id] ? 'rotate-180' : ''}`} />
                            </button>
                            {openSessions[session.id] && (
                              <div className="p-4 border-t text-sm space-y-2">
                                <p><strong>Date :</strong> {session.date}</p>
                                <p><strong>Heure :</strong> {session.time}</p>
                                <p><strong>Sujet :</strong> {session.topic}</p>
                                <p><strong>Notes :</strong> {session.mentor_notes || 'Aucune note'}</p>
                                <p><strong>Rating reçu :</strong> {session.rating ? `${session.rating}/5` : 'Non évalué'}</p>
                                <div className="mt-4">
                                  <label className="block text-sm font-medium mb-1">Ajouter un feedback</label>
                                  <textarea 
                                    className="w-full p-2 border rounded text-sm"
                                    placeholder="Votre feedback sur cette session..."
                                    rows="3"
                                  ></textarea>
                                  <div className="flex justify-end mt-2">
                                    <button className="px-3 py-1 border rounded text-sm bg-green-600 text-white">Enregistrer</button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Avis et évaluations</h3>
                    {reviewsLoading ? (
                      <p className="text-gray-500">Chargement des avis...</p>
                    ) : reviews.length === 0 ? (
                      <p className="text-gray-500">Aucun avis pour le moment.</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {reviews.map((review) => (
                          <div key={review.id} className="border rounded p-4">
                            <div className="flex justify-between">
                              <div className="font-medium">{review.student_name || 'Étudiant'}</div>
                              <div className="flex items-center">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <FaStar
                                    key={i}
                                    className={i < review.rating ? 'text-yellow-500' : 'text-gray-300'}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="mt-2 text-gray-700">{review.comment}</p>
                            <p className="mt-2 text-xs text-gray-500">
                              {new Date(review.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'messages' && <Inbox />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorProfile;
