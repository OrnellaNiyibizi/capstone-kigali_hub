import { AxiosError } from 'axios';
import api from './api';
import { Discussion, DiscussionResponse } from '../types/Discussion';

// Using relative path for API to work with Vite proxy
const API_URL = '/discussions';

// Helper function to handle API errors consistently
const handleApiError = (error: unknown, defaultMessage: string): never => {
  const axiosError = error as AxiosError<{ message?: string; error?: string }>;
  const errorMessage =
    axiosError.response?.data?.message ||
    axiosError.response?.data?.error ||
    defaultMessage;

  throw new Error(errorMessage);
};

// Get all discussions with optional category filter
export const fetchDiscussions = async (category?: string): Promise<Discussion[]> => {
  try {
    const url = category && category !== 'All' ? `${API_URL}?category=${category}` : API_URL;
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Failed to fetch discussions');
  }
};

// Get a single discussion by ID
export const fetchDiscussion = async (id: string): Promise<Discussion> => {
  try {
    const response = await api.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Failed to fetch discussion');
  }
};

// Create a new discussion
export const createDiscussion = async (
  discussionData: { title: string; content: string; category: string },
  token: string
): Promise<Discussion> => {
  try {
    const response = await api.post<DiscussionResponse>(API_URL, discussionData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.discussion;
  } catch (error) {
    return handleApiError(error, 'Failed to create discussion');
  }
};

// Update an existing discussion
export const updateDiscussion = async (
  id: string,
  discussionData: { title?: string; content?: string; category?: string },
  token: string
): Promise<Discussion> => {
  try {
    const response = await api.put<DiscussionResponse>(`${API_URL}/${id}`, discussionData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.discussion;
  } catch (error) {
    return handleApiError(error, 'Failed to update discussion');
  }
};

// Delete a discussion
export const deleteDiscussion = async (id: string, token: string): Promise<void> => {
  try {
    await api.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    handleApiError(error, 'Failed to delete discussion');
  }
};

// Add a comment to a discussion
export const addComment = async (
  discussionId: string,
  content: string,
  token: string
): Promise<Discussion> => {
  try {
    const response = await api.post<DiscussionResponse>(
      `${API_URL}/${discussionId}/comments`,
      { content },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // The backend returns { message, discussion }
    return response.data.discussion;
  } catch (error) {
    return handleApiError(error, 'Failed to add comment');
  }
};

// Delete a comment
export const deleteComment = async (
  discussionId: string,
  commentId: string,
  token: string
): Promise<Discussion> => {
  try {
    const response = await api.delete<DiscussionResponse>(
      `${API_URL}/${discussionId}/comments/${commentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Return the updated discussion with the comment removed
    return response.data.discussion;
  } catch (error) {
    return handleApiError(error, 'Failed to delete comment');
  }
};