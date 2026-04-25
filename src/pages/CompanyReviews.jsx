import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const CompanyReviews = () => {
  const { companyId } = useParams();
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState(null);
  const [newReview, setNewReview] = useState({ rating: 5, title: '', comment: '', pros: '', cons: '' });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
    fetchSummary();
  }, [companyId]);

  const fetchReviews = async () => {
    try {
      const response = await api.get(`/companies/${companyId}/reviews/`);
      setReviews(response.data);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await api.get(`/companies/${companyId}/reviews/summary/`);
      setSummary(response.data);
    } catch (error) {
      console.error('Failed to fetch summary:', error);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/companies/${companyId}/reviews/`, newReview);
      setShowForm(false);
      setNewReview({ rating: 5, title: '', comment: '', pros: '', cons: '' });
      fetchReviews();
      fetchSummary();
    } catch (error) {
      console.error('Failed to submit review:', error);
      alert('You can only review a company once');
    }
  };

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Rating Summary Header */}
      {summary && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 text-center">
          <div className="text-5xl font-bold text-yellow-500">{summary.average_rating}</div>
          <div className="text-2xl text-yellow-400">{renderStars(Math.round(summary.average_rating))}</div>
          <div className="text-gray-600">{summary.total_reviews} reviews</div>

          {/* Rating Distribution */}
          <div className="mt-4 space-y-1 max-w-md mx-auto">
            {[5, 4, 3, 2, 1].map(rating => (
              <div key={rating} className="flex items-center gap-2">
                <span className="w-8 text-sm">{rating}★</span>
                <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full"
                    style={{ width: `${(summary.rating_distribution[rating] / summary.total_reviews) * 100}%` }}
                  />
                </div>
                <span className="w-12 text-sm">{summary.rating_distribution[rating]}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Write Review Button */}
      {user && user.role === 'candidate' && !showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded mb-6 hover:bg-blue-700"
        >
          Write a Review
        </button>
      )}

      {/* Review Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-bold mb-4">Write Your Review</h3>
          <form onSubmit={submitReview}>
            <div className="mb-3">
              <label className="block font-bold mb-1">Rating</label>
              <select
                value={newReview.rating}
                onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                className="w-full p-2 border rounded"
              >
                {[5, 4, 3, 2, 1].map(r => (
                  <option key={r} value={r}>{r} Stars - {renderStars(r)}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="block font-bold mb-1">Review Title</label>
              <input
                type="text"
                value={newReview.title}
                onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                className="w-full p-2 border rounded"
                placeholder="Short summary of your experience"
              />
            </div>
            <div className="mb-3">
              <label className="block font-bold mb-1">Comment</label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                className="w-full p-2 border rounded"
                rows="4"
                placeholder="Share your experience..."
                required
              />
            </div>
            <div className="mb-3">
              <label className="block font-bold mb-1">Pros</label>
              <textarea
                value={newReview.pros}
                onChange={(e) => setNewReview({ ...newReview, pros: e.target.value })}
                className="w-full p-2 border rounded"
                rows="2"
                placeholder="What you liked..."
              />
            </div>
            <div className="mb-3">
              <label className="block font-bold mb-1">Cons</label>
              <textarea
                value={newReview.cons}
                onChange={(e) => setNewReview({ ...newReview, cons: e.target.value })}
                className="w-full p-2 border rounded"
                rows="2"
                placeholder="What could improve..."
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                Submit Review
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">All Reviews</h2>
        {reviews.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
            No reviews yet. Be the first to review!
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="text-yellow-500 text-xl">{renderStars(review.rating)}</div>
                  {review.title && <h3 className="font-bold text-lg mt-1">{review.title}</h3>}
                </div>
                <div className="text-gray-500 text-sm">{new Date(review.created_at).toLocaleDateString()}</div>
              </div>
              <p className="text-gray-700 mt-2">{review.comment}</p>
              {review.pros && (
                <div className="mt-3 p-3 bg-green-50 rounded">
                  <span className="font-bold text-green-700">👍 Pros:</span> {review.pros}
                </div>
              )}
              {review.cons && (
                <div className="mt-2 p-3 bg-red-50 rounded">
                  <span className="font-bold text-red-700">👎 Cons:</span> {review.cons}
                </div>
              )}
              <div className="text-gray-500 text-sm mt-3">- {review.reviewer_name}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CompanyReviews;