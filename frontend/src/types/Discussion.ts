export interface Comment {
  _id: string;
  content: string;
  user: {
    _id?: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

export interface Discussion {
  _id: string;
  title: string;
  content: string;
  category: string;
  user: {
    _id?: string;
    name: string;
    email: string;
  };
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}