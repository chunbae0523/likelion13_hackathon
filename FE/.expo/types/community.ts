export type Post = {
  id: string; // 문자열만 올 수 있음
  authorName: string;
  content: string;
  images?: string[];
  likes: number;
  commentsCount: number;
  createdAt: string; // ISO 문자열
  tags?: string[];
  caption?: string;
};

export type Paginated<T> = {
  items: T[];
  nextCursor?: string | null;
};