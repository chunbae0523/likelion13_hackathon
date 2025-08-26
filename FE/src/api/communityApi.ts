import { supabase } from "../lib/supabase";

import { Post } from "../types/community";

export type Paginated<T> = { items: T[]; nextCursor: string | null };

export async function fetchPosts(params?: {
  cursor?: string;
  limit?: number;
  sort?: string;
}) {
  const limit = params?.limit ?? 20;
  const cursor = params?.cursor;
  const sort = params?.sort ?? "created_at";

  let query = supabase
    .from("posts")
    .select("*")
    .order(sort, { ascending: false })
    .limit(limit);

  if (cursor) {
    query = query.gt("created_at", cursor);
  }

  const { data, error } = await query;

  if (error) throw error;

  // cursor는 마지막 아이템 생성일시 등으로 사용
  const nextCursor =
    data.length === limit ? data[data.length - 1]?.created_at : null;

  return { items: data, nextCursor };
}

// 생성
export async function createPost(payload: Post) {
  console.log(payload);
  const { data, error } = await supabase.from("posts").upsert([payload]);

  if (error) throw error;
  return data;
}

// ✅ 투표 (없으면 만들고, 있으면 업데이트)
export async function voteOnPost(
  postId: string,
  uiChoice: string | null
): Promise<Post> {
  const normalizedChoice = (() => {
    if (uiChoice === "vanilla") return "first";
    if (uiChoice === "matcha") return "second";
    return uiChoice;
  })();

  const { data, error } = await supabase
    .from("posts")
    .update({ choice: normalizedChoice }) // 컬럼명은 실제 스키마에 맞게 조정
    .eq("id", postId);

  if (error) throw error;

  return data[0];
}
