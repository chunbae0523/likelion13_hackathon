// src/types/community.ts
export type PollOption = { id: number; text: string; votes: number };
export type Poll = {
  question: string;
  options: PollOption[];
  userVote: number | null;
} | null;

// 기존 Post를 확장 (필드는 전부 optional로 두면 하위 호환 안전)
import type { Post as BasePost } from "../../.expo/types/community";

export type Post = BasePost & {
  images?: string[];
  poll?: Poll;
};
