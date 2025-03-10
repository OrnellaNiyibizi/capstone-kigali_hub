import { AxiosError } from 'axios';
import api from './api';
import { Discussion } from '../types/Discussion';

// Using relative path for API to work with Vite proxy
const API_URL = '/discussions';

export const fetchDiscussions = async (category?: string): Promise<Discussion[]> => {
  try {
    const url = category ? `${API_URL}?category=${category}` : API_URL;
    const response = await api.get(url);
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>;
    throw new Error(
      axiosError.response?.data?.message || 'Failed to fetch discussions'
    );
  }
};

export const fetchDiscussion = async (id: string): Promise<Discussion> => {
  try {
    const response = await api.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>;
    throw new Error(
      axiosError.response?.data?.message || 'Failed to fetch discussion'
    );
  }
};

export const createDiscussion = async (
  discussionData: { title: string; content: string; category: string },
  token: string
): Promise<Discussion> => {
  try {
    const response = await api.post(API_URL, discussionData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.discussion;
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>;
    throw new Error(
      axiosError.response?.data?.message || 'Failed to create discussion'
    );
  }
};

export const updateDiscussion = async (
  id: string,
  discussionData: { title?: string; content?: string; category?: string },
  token: string
): Promise<Discussion> => {
  try {
    const response = await api.put(`${API_URL}/${id}`, discussionData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.discussion;
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>;
    throw new Error(
      axiosError.response?.data?.message || 'Failed to update discussion'
    );
  }
};

export const deleteDiscussion = async (id: string, token: string): Promise<void> => {
  try {
    await api.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>;
    throw new Error(
      axiosError.response?.data?.message || 'Failed to delete discussion'
    );
  }
};

export const addComment = async (
  discussionId: string,
  content: string,
  token: string
): Promise<Discussion> => {
  try {
    const response = await api.post(
      `${API_URL}/${discussionId}/comments`,
      { content },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>;
    throw new Error(
      axiosError.response?.data?.message || 'Failed to add comment'
    );
  }
};

export const deleteComment = async (
  discussionId: string,
  commentId: string,
  token: string
): Promise<void> => {
  try {
    await api.delete(`${API_URL}/${discussionId}/comments/${commentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>;
    throw new Error(
      axiosError.response?.data?.message || 'Failed to delete comment'
    );
  }
};