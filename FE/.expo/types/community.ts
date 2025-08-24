// src/types/community.ts
export type Post = {
  id: string;
  authorName: string;
  content: string;
  images?: string[];
  likes: number;
  commentsCount: number;
  createdAt: string; // ISO
  tags?: string[];
  caption?: string;
  poll?: Poll;
};

export type PollOption = {
  id: string; // string으로 통일
  label?: string; // __fake__에서 쓰던 label
  text?: string; // UI가 text만 기대할 때 대비
  votes: number;
};

export type Poll = {
  question?: string;
  options: PollOption[];
  myChoice?: string | null; // 과거 userVote 대체
} | null;

export type Paginated<T> = {
  items: T[];
  nextCursor?: string | null;
};
