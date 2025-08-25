import { supabase } from "../lib/supabase";

// 앱에서 쓰는 타입 (필요 시 네 타입으로 맞춰도 OK)
export type Post = {
  id: string;
  authorName: string;
  content: string;
  images: string[];
  likes: number;
  commentsCount: number;
  createdAt: string; // ISO
  tags: string[];
  poll?: {
    options: { id: string; label: string; votes: number }[];
    myChoice: string | null;
  } | null;
};

export type Paginated<T> = { items: T[]; nextCursor: string | null };

// 목록
export async function fetchPosts(params?: { cursor?: string; limit?: number }): Promise<Paginated<Post>> {
  const limit = params?.limit ?? 20;
  let q = supabase.from("posts").select("*").order("created_at", { ascending: false }).limit(limit + 1);
  if (params?.cursor) q = q.lt("created_at", params.cursor);

  const { data, error } = await q;
  if (error) throw error;

  const hasMore = (data?.length ?? 0) > limit;
  const rows = hasMore ? data!.slice(0, limit) : (data ?? []);
  const items: Post[] = rows.map((r: any) => ({
    id: r.id,
    authorName: r.author_name,
    content: r.content,
    images: r.images ?? [],
    likes: r.likes ?? 0,
    commentsCount: r.comments_count ?? 0,
    createdAt: r.created_at,
    tags: r.tags ?? [],
    poll: r.poll ?? null,
  }));
  const nextCursor = hasMore ? items[items.length - 1].createdAt : null;
  return { items, nextCursor };
}

// 생성
export async function createPost(data: Omit<Post, "id" | "createdAt">): Promise<Post> {
  const { data: row, error } = await supabase
    .from("posts")
    .insert({
      author_name: data.authorName,
      content: data.content,
      images: data.images ?? [],
      likes: data.likes ?? 0,
      comments_count: data.commentsCount ?? 0,
      tags: data.tags ?? [],
      poll: data.poll ?? null,
    })
    .select("*")
    .single();

  if (error) throw error;

  return {
    id: row.id,
    authorName: row.author_name,
    content: row.content,
    images: row.images ?? [],
    likes: row.likes ?? 0,
    commentsCount: row.comments_count ?? 0,
    createdAt: row.created_at,
    tags: row.tags ?? [],
    poll: row.poll ?? null,
  };
}

// ✅ 투표 (없으면 만들고, 있으면 업데이트)
export async function voteOnPost(postId: string, uiChoice: string | null) {
  // 1) 현재 poll 읽기
  const { data: cur, error } = await supabase
    .from('posts').select('*').eq('id', postId).single();
  if (error) throw error;
  if (!cur.poll || !Array.isArray(cur.poll.options)) {
    throw new Error('투표가 없는 게시물');
  }

  const opts = cur.poll.options.map((o: any) => ({ ...o }));
  const prev = cur.poll.myChoice ?? null;

  // 2) UI id → 실제 옵션 id로 매핑
  //    - 옵션이 2개라는 전제에서, 첫 번째/두 번째를 각각 vanilla/matcha로 간주
  const firstId  = opts[0]?.id; // 'A' 또는 'vanilla'
  const secondId = opts[1]?.id; // 'B' 또는 'matcha'

  const toRealId = (c: string | null) => {
    if (c == null) return null;
    if (c === 'vanilla') return firstId;
    if (c === 'matcha')  return secondId;
    return c; // 이미 'A'/'B' 같은 실제 id가 들어온 경우 그대로
  };

  const choice = toRealId(uiChoice);

  // 3) 표 수 증감
  if (prev != null) {
    const i = opts.findIndex(o => o.id === prev);
    if (i >= 0 && opts[i].votes > 0) opts[i].votes -= 1;
  }
  if (choice != null) {
    const i = opts.findIndex(o => o.id === choice);
    if (i >= 0) opts[i].votes += 1;
  }

  // 4) 저장
  const nextPoll = { ...cur.poll, options: opts, myChoice: choice };
  const { data: updated, error: updErr } = await supabase
    .from('posts').update({ poll: nextPoll }).eq('id', postId)
    .select('*').single();
  if (updErr) throw updErr;

  // (필요하면 camelCase로 매핑해서 반환)
  return updated;
}

