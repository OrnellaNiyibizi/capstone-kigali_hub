import { Discussion } from '../types/Discussion';

const API_URL = 'http://localhost:3000/api/discussions';

export const fetchDiscussions = async (category?: string): Promise<Discussion[]> => {
  const url = category ? `${API_URL}?category=${category}` : API_URL;
  const response = await fetch(url);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch discussions');
  }
  
  return await response.json();
};

export const fetchDiscussion = async (id: string): Promise<Discussion> => {
  const response = await fetch(`${API_URL}/${id}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch discussion');
  }
  
  return await response.json();
};

export const createDiscussion = async (
  discussionData: { title: string; content: string; category: string },
  token: string
): Promise<Discussion> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(discussionData),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create discussion');
  }
  
  const data = await response.json();
  return data.discussion;
};

export const updateDiscussion = async (
  id: string,
  discussionData: { title?: string; content?: string; category?: string },
  token: string
): Promise<Discussion> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(discussionData),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update discussion');
  }
  
  const data = await response.json();
  return data.discussion;
};

export const deleteDiscussion = async (id: string, token: string): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete discussion');
  }
};

export const addComment = async (
  discussionId: string,
  content: string,
  token: string
): Promise<Discussion> => {
  const response = await fetch(`${API_URL}/${discussionId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to add comment');
  }
  
  const data = await response.json();
  return data.discussion;
};

export const deleteComment = async (
  discussionId: string,
  commentId: string,
  token: string
): Promise<void> => {
  const response = await fetch(`${API_URL}/${discussionId}/comments/${commentId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete comment');
  }
};