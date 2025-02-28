import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  fetchDiscussion,
  addComment,
  deleteDiscussion,
  deleteComment,
} from '../../services/discussionService';
import { Discussion, Comment } from '../../types/Discussion';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/homepage/Header';
import Footer from '../../components/homepage/Footer';

const DiscussionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [discussion, setDiscussion] = useState<Discussion | null>(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { isAuthenticated, user, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadDiscussion = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const data = await fetchDiscussion(id);
        setDiscussion(data);
        setError('');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    loadDiscussion();
  }, [id]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id || !token || !comment.trim()) return;

    try {
      setSubmitting(true);
      const updatedDiscussion = await addComment(id, comment, token);
      setDiscussion(updatedDiscussion);
      setComment('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteDiscussion = async () => {
    if (
      !id ||
      !token ||
      !window.confirm('Are you sure you want to delete this discussion?')
    )
      return;

    try {
      await deleteDiscussion(id, token);
      navigate('/discussions');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to delete discussion'
      );
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (
      !id ||
      !token ||
      !window.confirm('Are you sure you want to delete this comment?')
    )
      return;

    try {
      await deleteComment(id, commentId, token);
      // Update the discussion UI by removing the deleted comment
      if (discussion) {
        setDiscussion({
          ...discussion,
          comments: discussion.comments.filter((c) => c._id !== commentId),
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete comment');
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const canModifyDiscussion =
    discussion && isAuthenticated && user?.email === discussion.user?.email;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <Link
            to="/discussions"
            className="inline-flex items-center text-purple-600 hover:text-purple-800 mb-6">
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to discussions
          </Link>

          {/* Error message */}
          {error && (
            <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Loading state */}
          {loading ? (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-purple-500 border-t-transparent"></div>
              <p className="mt-2 text-gray-600">Loading discussion...</p>
            </div>
          ) : discussion ? (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Discussion header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {discussion.title}
                  </h1>
                  <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                    {discussion.category}
                  </span>
                </div>

                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <span>
                    Posted by {discussion.user?.name || 'Unknown User'}
                  </span>
                  <span className="mx-2">•</span>
                  <span>{formatDate(discussion.createdAt)}</span>
                </div>

                {/* Discussion content */}
                <div className="mt-6 prose max-w-none text-gray-800">
                  <p>{discussion.content}</p>
                </div>

                {/* Discussion actions */}
                {canModifyDiscussion && (
                  <div className="mt-6 flex space-x-3">
                    <Link
                      to={`/discussions/edit/${discussion._id}`}
                      className="text-blue-600 hover:text-blue-800">
                      Edit
                    </Link>
                    <button
                      onClick={handleDeleteDiscussion}
                      className="text-red-600 hover:text-red-800">
                      Delete
                    </button>
                  </div>
                )}
              </div>

              {/* Comments section */}
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Comments ({discussion.comments.length})
                </h2>

                {/* Comment form */}
                {isAuthenticated ? (
                  <form onSubmit={handleSubmitComment} className="mb-8">
                    <div className="mb-4">
                      <label
                        htmlFor="comment"
                        className="block text-sm font-medium text-gray-700 mb-1">
                        Add a comment
                      </label>
                      <textarea
                        id="comment"
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed">
                      {submitting ? 'Submitting...' : 'Post Comment'}
                    </button>
                  </form>
                ) : (
                  <div className="mb-8 p-4 bg-gray-100 rounded-md text-center">
                    <p className="text-gray-700">
                      Please{' '}
                      <Link
                        to="/login"
                        className="text-purple-600 hover:text-purple-800">
                        sign in
                      </Link>{' '}
                      to join the discussion.
                    </p>
                  </div>
                )}

                {/* Comments list */}
                <div className="space-y-6">
                  {discussion.comments.length === 0 ? (
                    <p className="text-gray-500 text-center py-6">
                      No comments yet. Be the first to comment!
                    </p>
                  ) : (
                    discussion.comments.map((comment: Comment) => (
                      <div
                        key={comment._id}
                        className="border-b border-gray-200 pb-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center">
                              <span className="font-medium text-gray-900">
                                {comment.user?.name || 'Unknown User'}
                              </span>
                              <span className="mx-2 text-gray-500">•</span>
                              <span className="text-sm text-gray-500">
                                {formatDate(comment.createdAt)}
                              </span>
                            </div>
                            <p className="mt-2 text-gray-700">
                              {comment.content}
                            </p>
                          </div>
                          {isAuthenticated &&
                            user?.email === comment.user.email && (
                              <button
                                onClick={() => handleDeleteComment(comment._id)}
                                className="text-sm text-red-600 hover:text-red-800">
                                Delete
                              </button>
                            )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 bg-white rounded-lg shadow-md">
              <p className="text-gray-700">
                Discussion not found or has been deleted.
              </p>
              <Link
                to="/discussions"
                className="mt-4 inline-block text-purple-600 hover:text-purple-800">
                View all discussions
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DiscussionDetail;
