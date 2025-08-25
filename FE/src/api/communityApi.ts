import apiClient, {BASE_URL} from "./apiClient";

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

const URL = BASE_URL + "/api/v1/community/posts";

// 목록
export async function fetchPosts(params?: { cursor?: string; limit?: number; sort?: string }): Promise<Paginated<Post>> {
  const limit = params?.limit ?? 20;
  const cursorParam = params?.cursor ? `&cursor=${encodeURIComponent(params.cursor)}` : '';
  const sortParam = params?.sort ? `&sort=${encodeURIComponent(params.sort)}` : '';
  const url = `${URL}?limit=${limit}${cursorParam}${sortParam}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch posts');

  const data = await res.json();

  const items:Post[] = data;

  const nextCursor = data.nextCursor ?? null;

  return { items, nextCursor };
}

// 생성
export async function createPost(payload: Post) {
  const response = await fetch(`${BASE_URL}/api/v1/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to create post: ${response.statusText}`);
  } 
  else { console.log('Post created successfully'); }

}

// ✅ 투표 (없으면 만들고, 있으면 업데이트)
export async function voteOnPost(postId: string, uiChoice: string | null): Promise<Post> {
  // 1) 클라이언트가 선택한 uiChoice를 API에 보낼 형태로 매핑
  const normalizedChoice = (() => {
    if (uiChoice === 'vanilla') return 'first';  // 서버에서 처리하는 값 예시
    if (uiChoice === 'matcha') return 'second';
    return uiChoice; // 이미 실제 투표 option id 인 경우
  })();

  // 2) API 호출 - 투표 생성/수정 요청 (서버가 내부에서 모든 투표 로직 수행)
  const response = await fetch(`${URL}/${encodeURIComponent(postId)}`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ choice: normalizedChoice }),
  });

  if (!response.ok) {
    throw new Error(`투표 처리 실패: ${response.statusText}`);
  }

  // 3) 서버에서 응답한 업데이트 된 게시글/투표 정보 받기
  const updatedPost: Post = await response.json();
  return updatedPost;
}
