export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface Comment {
  _id: string;
  content: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Discussion {
  _id: string;
  title: string;
  content: string;
  category: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  comments: Comment[]; // Ensure this is always initialized (even if empty)
  createdAt: string;
  updatedAt: string;
}

// API response types for better type safety
export interface DiscussionResponse {
  message?: string;
  discussion: Discussion;
}