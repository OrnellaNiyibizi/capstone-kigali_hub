import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  fetchDiscussion,
  addComment,
  deleteDiscussion,
  deleteComment,
} from '../../services/discussionService';
import { Discussion, Comment } from '../../types/Discussion';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import { FaArrowLeft, FaEdit, FaTrash, FaUser, FaClock } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const DiscussionDetail: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [discussion, setDiscussion] = useState<Discussion | null>(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const { isAuthenticated, user, token } = useAuth();
  const navigate = useNavigate();
  const [deletingComments, setDeletingComments] = useState<
    Record<string, boolean>
  >({});

  // Load the discussion data
  const loadDiscussion = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      const data = await fetchDiscussion(id);
      setDiscussion(data);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error loading discussion:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadDiscussion();
  }, [loadDiscussion]);

  // Submit a comment
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id || !token || !comment.trim()) return;

    try {
      setSubmitLoading(true);
      setError('');

      // Call API to add comment
      const updatedDiscussion = await addComment(id, comment.trim(), token);

      // Replace the entire discussion with the updated one from backend
      setDiscussion(updatedDiscussion);

      // Clear the comment input
      setComment('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add comment');
      console.error('Error adding comment:', err);
    } finally {
      setSubmitLoading(false);
    }
  };

  // Delete the entire discussion
  const handleDeleteDiscussion = async () => {
    if (!id || !token || !discussion) return;

    let confirmMessage = t(
      'discussions.deleteConfirm',
      'Are you sure you want to delete this discussion?'
    );

    // Check if discussion has comments and provide a more specific warning
    if (discussion.comments && discussion.comments.length > 0) {
      confirmMessage = t(
        'discussions.deleteWithCommentsConfirm',
        'This discussion has {{count}} comments. Deleting it will remove all comments. Are you sure you want to proceed?',
        { count: discussion.comments.length }
      );
    }

    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      setLoading(true);
      await deleteDiscussion(id, token);
      navigate('/discussions', { replace: true });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to delete discussion'
      );
      console.error('Error deleting discussion:', err);
      setLoading(false);
    }
  };

  // Delete a comment
  const handleDeleteComment = async (commentId: string) => {
    if (!id || !token) return;

    if (
      !window.confirm(
        t(
          'discussions.deleteConfirm',
          'Are you sure you want to delete this comment?'
        )
      )
    ) {
      return;
    }

    try {
      // Set loading state for this specific comment
      setDeletingComments((prev) => ({ ...prev, [commentId]: true }));

      const updatedDiscussion = await deleteComment(id, commentId, token);
      setDiscussion(updatedDiscussion);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete comment');
      console.error('Error deleting comment:', err);
    } finally {
      // Clear loading state
      setDeletingComments((prev) => {
        const updated = { ...prev };
        delete updated[commentId];
        return updated;
      });
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
    return new Date(dateString).toLocaleDateString(
      i18n.language === 'rw' ? 'fr-RW' : undefined,
      options
    );
  };

  // Check if the current user can modify the discussion
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
            <FaArrowLeft className="mr-2" />{' '}
            {t('discussions.back', 'Back to discussions')}
          </Link>

          {/* Error message */}
          {error && (
            <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Loading state */}
          {loading && !discussion ? (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-purple-500 border-t-transparent"></div>
              <p className="mt-2 text-gray-600">
                {t('discussions.loading', 'Loading discussions...')}
              </p>
            </div>
          ) : error && !discussion ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <Link
                to="/discussions"
                className="inline-block text-purple-600 hover:text-purple-800">
                {t('discussions.viewAll', 'View all discussions')}
              </Link>
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
                  <FaUser className="mr-1" />
                  <span>
                    {t('discussions.postedBy', 'Posted by')}{' '}
                    {discussion.user?.name || 'Unknown User'}
                  </span>
                  <span className="mx-2">•</span>
                  <FaClock className="mr-1" />
                  <span>{formatDate(discussion.createdAt)}</span>
                </div>

                {/* Discussion content */}
                <div className="mt-6 prose max-w-none text-gray-800">
                  <p>{discussion.content}</p>
                </div>

                {/* Discussion actions */}
                {canModifyDiscussion && (
                  <div className="mt-6 flex space-x-4">
                    <Link
                      to={`/discussions/edit/${discussion._id}`}
                      className="inline-flex items-center text-blue-600 hover:text-blue-800">
                      <FaEdit className="mr-1" />{' '}
                      {t('discussions.edit', 'Edit')}
                    </Link>
                    <button
                      onClick={handleDeleteDiscussion}
                      className="inline-flex items-center text-red-600 hover:text-red-800">
                      <FaTrash className="mr-1" />{' '}
                      {t('discussions.delete', 'Delete')}
                    </button>
                  </div>
                )}
              </div>

              {/* Comments section */}
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  {t('discussions.commentsTitle', 'Comments')} (
                  {discussion.comments?.length || 0})
                </h2>

                {/* Comment form */}
                {isAuthenticated ? (
                  <form onSubmit={handleSubmitComment} className="mb-8">
                    <div className="mb-4">
                      <label
                        htmlFor="comment"
                        className="block text-sm font-medium text-gray-700 mb-1">
                        {t('discussions.addComment', 'Add a comment')}
                      </label>
                      <textarea
                        id="comment"
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                        disabled={submitLoading}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={submitLoading}
                      className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed">
                      {submitLoading ? (
                        <>
                          <span className="inline-block animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                          {t('discussions.posting', 'Posting...')}
                        </>
                      ) : (
                        t('discussions.postComment', 'Post Comment')
                      )}
                    </button>
                  </form>
                ) : (
                  <div className="mb-8 p-4 bg-gray-100 rounded-md text-center">
                    <p className="text-gray-700">
                      {t(
                        'discussions.signInToComment',
                        'Please sign in to join the discussion.'
                      )}
                    </p>
                  </div>
                )}

                {/* Comments list */}
                <div className="space-y-6">
                  {!discussion.comments || discussion.comments.length === 0 ? (
                    <p className="text-gray-500 text-center py-6">
                      {t(
                        'discussions.noComments',
                        'No comments yet. Be the first to comment!'
                      )}
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
                            user?.email === comment.user?.email && (
                              <button
                                onClick={() => handleDeleteComment(comment._id)}
                                disabled={deletingComments[comment._id]}
                                className="text-sm text-red-600 hover:text-red-800 inline-flex items-center">
                                {deletingComments[comment._id] ? (
                                  <>
                                    <span className="animate-spin h-3 w-3 border-2 border-red-500 border-opacity-50 border-t-transparent rounded-full mr-1"></span>
                                    {t('discussions.deleting', 'Deleting...')}
                                  </>
                                ) : (
                                  <>
                                    <FaTrash className="mr-1" />{' '}
                                    {t('discussions.delete', 'Delete')}
                                  </>
                                )}
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
                {t(
                  'discussions.notFound',
                  'Discussion not found or has been deleted.'
                )}
              </p>
              <Link
                to="/discussions"
                className="mt-4 inline-block text-purple-600 hover:text-purple-800">
                {t('discussions.viewAll', 'View all discussions')}
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
