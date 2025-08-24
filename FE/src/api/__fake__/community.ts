// src/api/__fake__/community.ts
import type { Paginated, Post } from "../../../.expo/types/community";

// 백엔드 Post를 느슨하게 확장: images/poll을 테스트용으로 추가
type PollOption = {
  id: string | number;
  label?: string;
  text?: string;
  votes: number;
};
type Poll = {
  options: PollOption[];
  myChoice?: string | number | null;
};
type ExtendedPost = Post & {
  images?: string[];
  poll?: Poll;
};

// 더미 데이터 (images + poll 포함)
// NOTE: 여기서 poll 옵션 id는 임의 값입니다. 화면 쪽 toFeedItem()이 1,2번째 옵션만 사용.
const fixtures: ExtendedPost[] = [
  {
    id: "p1",
    authorName: "홍길동",
    content: "오늘 날씨 최고 ☀️",
    likes: 12,
    commentsCount: 3,
    createdAt: new Date().toISOString(),
    tags: ["동네행사"],
    images: ["https://picsum.photos/seed/sun1/900/600"],
    poll: {
      options: [
        { id: "A", label: "갑시다", votes: 5 },
        { id: "B", label: "패스", votes: 2 },
      ],
      myChoice: null,
    },
  },
  {
    id: "p2",
    authorName: "김민수",
    content: "근처 라멘집 강추 🍜",
    likes: 25,
    commentsCount: 5,
    createdAt: new Date(Date.now() - 3600_000).toISOString(),
    tags: ["맛집"],
    images: ["https://picsum.photos/seed/ramen/1000/700"],
    poll: {
      options: [
        { id: "A", label: "돈코츠", votes: 10 },
        { id: "B", label: "쇼유", votes: 6 },
      ],
      myChoice: "B",
    },
  },
  {
    id: "p3",
    authorName: "username123",
    content: "라떼 메뉴 중 어떤 게 더 끌리시나요??",
    caption: "맛있겠다", // 👈 서버에도 caption 필드 포함
    likes: 1700,
    commentsCount: 1735,
    createdAt: new Date(Date.now() - 7200_000).toISOString(),
    tags: ["인천", "연수구", "소문난 카페", "바닐라 라떼", "말차 라떼", "투표"],
    images: ["https://picsum.photos/seed/latte/900/600"],
    poll: {
      options: [
        { id: "vanilla", label: "바닐라 라떼", votes: 45 },
        { id: "matcha", label: "말차 라떼", votes: 58 },
      ],
      myChoice: null,
    },
  },
];

// 목록
export async function fakeFetchPosts(params?: {
  cursor?: string;
  limit?: number;
}): Promise<Paginated<Post>> {
  const start = params?.cursor ? parseInt(params.cursor, 10) : 0;
  const limit = params?.limit ?? 20;
  const page = fixtures.slice(start, start + limit);
  return {
    items: page as Post[], // ExtendedPost ⊂ Post : 추가 필드는 무시되고 화면에서 toFeedItem로 사용
    nextCursor: start + limit < fixtures.length ? String(start + limit) : null,
  };
}

// 상세
export async function fakeFetchPost(id: string): Promise<Post> {
  const item = fixtures.find((p) => p.id === id);
  if (!item) throw new Error("존재하지 않는 게시물");
  return item as Post;
}

/**
 * 가짜 투표 API
 * - 같은 항목 재클릭 = 취소 UX를 지원하려면 optionId에 null을 허용
 * - 여기서는 간단히 '선택'만 처리(취소도 가능)
 */
export async function fakeVote(
  postId: string,
  optionId: string | number | null
): Promise<Post> {
  const idx = fixtures.findIndex((p) => p.id === postId);
  if (idx < 0) throw new Error("존재하지 않는 게시물");

  const post = fixtures[idx];
  if (!post.poll) throw new Error("투표가 없는 게시물");

  const already = post.poll.myChoice ?? null;
  const nextOptions = post.poll.options.map((o: PollOption) => ({ ...o }));

  // 기존 선택 해제(-1)
  if (already != null) {
    const prevIdx = nextOptions.findIndex((o: PollOption) => o.id === already);
    if (prevIdx >= 0 && nextOptions[prevIdx].votes > 0) {
      nextOptions[prevIdx].votes -= 1;
    }
  }

  // 새 선택(+1) — 취소(null)이면 스킵
  if (optionId != null) {
    const curIdx = nextOptions.findIndex((o: PollOption) => o.id === optionId);
    if (curIdx >= 0) nextOptions[curIdx].votes += 1;
  }

  const next: ExtendedPost = {
    ...post,
    poll: {
      options: nextOptions,
      myChoice: optionId,
    },
  };

  fixtures[idx] = next;
  return next as Post;
}

export async function fakeCreatePost(data: Post): Promise<Post> {
  const newPost = {
    ...data,
    id: `p${fixtures.length + 1}`,
    createdAt: new Date().toISOString(),
  };
  fixtures.push(newPost);
  return newPost;
}
