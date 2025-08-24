// src/api/communityApi.ts
import apiClient from "./apiClient";
import type { Paginated, Post } from "../../.expo/types/community";
import {
  fakeFetchPosts,
  fakeFetchPost,
  fakeVote,
  fakeCreatePost,
} from "./__fake__/community";

export const voteOnPost = fakeVote; // ✅ 추가ty";

// ✅ 서버 열리면 false로 바꾸기만 하면 실서버로 전환됨
const USE_FAKE = true; // ← 지금은 API가 비어있다고 했으니 true. 열리면 false!

// 서버의 엔드포인트 경로 (백엔드 명세에 맞춰 필요하면 바꾸세요)
const LIST_PATH = "/community/posts"; // 예: GET http://3.38.103.173/community/posts
const DETAIL_PATH = (id: string) => `/community/posts/${id}`;

export async function fetchPosts(params?: {
  cursor?: string;
  limit?: number;
}): Promise<Paginated<Post>> {
  if (USE_FAKE) return fakeFetchPosts(params);

  const { data } = await apiClient.get<Paginated<Post>>(LIST_PATH, {
    params: { cursor: params?.cursor, limit: params?.limit ?? 20 },
  });
  return data;
}

export async function fetchPost(id: string): Promise<Post> {
  if (USE_FAKE) return fakeFetchPost(id);

  const { data } = await apiClient.get<Post>(DETAIL_PATH(id));
  return data;
}

export async function createPost(data: Post): Promise<Post> {
  if (USE_FAKE) {
    return fakeCreatePost(data);
  }

  const { data: responseData } = await apiClient.post<Post>(LIST_PATH, data);
  return responseData;
}
