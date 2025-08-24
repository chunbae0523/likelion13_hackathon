// src/api/__fake__/community.ts
import type { Paginated, Post } from "@/types/community"; // 별칭 없으면 ../../types/community

const fixtures: Post[] = [
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
      myChoice: "null",
    },
  },
  {
    id: "p3",
    authorName: "username123",
    content: "라떼 메뉴 중 어떤 게 더 끌리시나요??",
    caption: "맛있겠다",
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

//커뮤니티 탭에서 게시물 주주룩 보여주기(여러개)
export async function fakeFetchPosts(params?: { cursor?: string; limit?: number }): Promise<Paginated<Post>> {
  const start = params?.cursor ? parseInt(params.cursor, 10) : 0;
  const limit = params?.limit ?? 20;
  return {
    items: fixtures.slice(start, start + limit),
    nextCursor: start + limit < fixtures.length ? String(start + limit) : null,
  };
}
//게시물 상세보기(1개씩)
export async function fakeFetchPost(id: string): Promise<Post> {
  const item = fixtures.find((p) => p.id === id);
  if (!item) throw new Error("존재하지 않는 게시물");
  return item;
}

/** 같은 항목 재클릭 시 취소하려면 optionId=null 전달 */
export async function fakeVote(postId: string, optionId: string | null): Promise<Post> {
  const idx = fixtures.findIndex((p) => p.id === postId);
  if (idx < 0) throw new Error("존재하지 않는 게시물");

  const post = fixtures[idx];
  if (!post.poll) throw new Error("투표가 없는 게시물");

  const already = post.poll.myChoice ?? null;
  const nextOptions = post.poll.options.map((o) => ({ ...o }));

  if (already != null) {
    const prev = nextOptions.findIndex((o) => o.id === already);
    if (prev >= 0 && nextOptions[prev].votes > 0) nextOptions[prev].votes -= 1;
  }
  if (optionId != null) {
    const cur = nextOptions.findIndex((o) => o.id === optionId);
    if (cur >= 0) nextOptions[cur].votes += 1;
  }

  const next: Post = {
    ...post,
    poll: { ...post.poll, options: nextOptions, myChoice: optionId },
  };
  fixtures[idx] = next;
  return next;
}
