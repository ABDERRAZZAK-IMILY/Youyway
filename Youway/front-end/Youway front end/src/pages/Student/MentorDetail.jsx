import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { axiosClient } from '../../api/axios';
import { FaStar, FaRegStar, FaCalendarAlt, FaUserGraduate, FaClock, FaDollarSign, FaThumbsUp } from 'react-icons/fa';

const MentorDetail = () => {
  const { mentorId } = useParams();
  const navigate = useNavigate();
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    
    if (token) {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      console.log('User data in localStorage:', userData);
      if (userData.student) {
        console.log('Student data found:', userData.student);
      } else {
        console.log('No student data found in userData');
      }
    }
    
    const fetchMentorData = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get(`/mentors/${mentorId}`);
        setMentor(response.data);
        setLoading(false);
        
        try {
          const reviewsResponse = await axiosClient.get(`/mentors/${mentorId}/reviews`);
          setReviews(reviewsResponse.data || []);
        } catch (reviewErr) {
          console.error('Error fetching reviews:', reviewErr);
          setReviews([]);
        }
      } catch (err) {
        console.error('Error fetching mentor data:', err);
        setError('Failed to load mentor details');
        setLoading(false);
      }
    };

    fetchMentorData();
  }, [mentorId]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to submit a review');
        navigate('/login');
        return;
      }
      
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      console.log('User data for review submission:', userData);
      
     
      if (userData.role === "Student" && userData.id) {
        try {
          console.log('Backend has database schema issues - using frontend-only implementation for now');
          console.log('Database error: "rating" column missing in mentors table');
          
          const newReview = {
            id: Date.now(),
            student_name: userData.name || 'You',
            rating: rating,
            comment: reviewText,
            created_at: new Date().toISOString()
          };
          
          setReviews([newReview, ...reviews]);
          setReviewText('');
          setRating(0);
          setReviewSubmitted(true);
          
          if (mentor) {
            const totalRatings = reviews.length + 1;
            const totalStars = reviews.reduce((sum, review) => sum + review.rating, 0) + rating;
            const newAverageRating = totalStars / totalRatings;
            setMentor({...mentor, rating: newAverageRating});
          }
          
          
          setTimeout(() => {
            setReviewSubmitted(false);
          }, 3000);
        } catch (err) {
          console.error('Error submitting review:', err);
          if (err.response && err.response.data) {
            console.log('Error response data:', err.response.data);
            const errorMessage = err.response.data.message || JSON.stringify(err.response.data);
            alert(`Review submission failed: ${errorMessage}`);
          } else {
            alert('Failed to submit review. Please try again.');
          }
        }
      } else {
        alert('only student can submit review');
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      if (err.response && err.response.data) {
        console.log('Error response data:', err.response.data);
        const errorMessage = err.response.data.message || JSON.stringify(err.response.data);
        alert(`Review submission failed: ${errorMessage}`);
      } else {
        alert('Failed to submit review. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error && !mentor) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p>{error}</p>
        </div>
        <button
          onClick={() => navigate('/mentores')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Back to Mentors
        </button>
      </div>
    );
  }

  if (!mentor) {
    return null;
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="md:flex">
          <div className="md:w-1/3 h-64 md:h-auto">
            <img
              src={mentor.image_path ? `http://localhost:80/storage/${mentor.image_path}` : 'https://via.placeholder.com/300'}
              alt={mentor.user?.name || 'Mentor'}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="md:w-2/3 p-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{mentor.user?.name || 'Mentor Name'}</h1>
                <p className="text-lg text-blue-600 font-semibold">{mentor.domaine || 'Specialization'}</p>
              </div>
              
              <div className="flex items-center">
                <div className="flex text-yellow-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star}>
                      {star <= Math.round(mentor.rating || 0) ? <FaStar /> : <FaRegStar />}
                    </span>
                  ))}
                </div>
                <span className="ml-2 text-gray-600 font-medium">
                  {mentor.rating ? mentor.rating.toFixed(1) : 'No ratings yet'}
                </span>
              </div>
            </div>
            
            <div className="mt-4 space-y-3">
              <div className="flex items-center">
                <FaUserGraduate className="text-gray-500 mr-2" />
                <span>{mentor.university || 'University/Institution'}</span>
              </div>
              <div className="flex items-center">
                <FaClock className="text-gray-500 mr-2" />
                <span>{mentor.years_experience || 'N/A'} years of experience</span>
              </div>
              <div className="flex items-center">
                <FaDollarSign className="text-gray-500 mr-2" />
                <span>${mentor.hourly_rate || '0'}/hour</span>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800">About Me</h3>
              <p className="text-gray-600 mt-2">{mentor.bio || 'No bio available.'}</p>
            </div>
            
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to={`/book-session/${mentorId}`}
                className="bg-green-500 text-white px-6 py-2 rounded flex items-center hover:bg-green-600 transition"
              >
                <FaCalendarAlt className="mr-2" />
                Book a Session
              </Link>
              {isAuthenticated ? (
                <button
                  onClick={() => document.getElementById('reviewSection').scrollIntoView({ behavior: 'smooth' })}
                  className="bg-blue-500 text-white px-6 py-2 rounded flex items-center hover:bg-blue-600 transition"
                >
                  <FaThumbsUp className="mr-2" />
                  Leave a Review
                </button>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="bg-blue-500 text-white px-6 py-2 rounded flex items-center hover:bg-blue-600 transition"
                >
                  <FaThumbsUp className="mr-2" />
                  Login to Leave a Review
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Skills & Expertise</h2>
        <div className="flex flex-wrap gap-2">
          {mentor.competences?.split(',').map((skill, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
            >
              {skill.trim()}
            </span>
          )) || 'No skills listed.'}
        </div>
      </div>
      
      <div id="reviewSection" className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Reviews & Ratings</h2>
        
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Leave a Review</h3>
          {reviewSubmitted ? (
            <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
              Thank you for your review!
            </div>
          ) : (
            isAuthenticated ? (
              <form onSubmit={handleSubmitReview}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Rating</label>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="text-2xl text-yellow-400 focus:outline-none"
                      >
                        {star <= (hoverRating || rating) ? <FaStar /> : <FaRegStar />}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <label htmlFor="reviewText" className="block text-gray-700 mb-2">
                    Your Review
                  </label>
                  <textarea
                    id="reviewText"
                    rows="4"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Share your experience with this mentor..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                  Submit Review
                </button>
              </form>
            ) : (
              <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                You must be logged in to leave a review.
              </div>
            )
          )}
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {reviews.length > 0 ? `All Reviews (${reviews.length})` : 'No reviews yet'}
          </h3>
          
          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border-b pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-800">{review.student_name}</h4>
                      <div className="flex text-yellow-400 my-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star}>
                            {star <= review.rating ? <FaStar className="text-sm" /> : <FaRegStar className="text-sm" />}
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">{formatDate(review.created_at)}</span>
                  </div>
                  <p className="text-gray-600 mt-2">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">Be the first to leave a review!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorDetail;
