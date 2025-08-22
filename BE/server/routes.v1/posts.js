// routes.v1/posts.js
import crypto from "crypto";
import { Router } from "express";

const router = Router();

/** 메모리 저장소 (서버 재시작하면 초기화됨) */
const POSTS = [];

/** 1) 글 목록
 *  - GET /api/v1/posts?limit=20&offset=0
 *  - 최신순으로 반환
 */
router.get("/", (req, res) => {
  const limit  = Math.min(100, Math.max(1, Number(req.query.limit ?? 20))); // 1~100
  const offset = Math.max(0, Number(req.query.offset ?? 0));

  // 최신순(POST에서 unshift로 앞에 넣으니 그대로 잘림)
  const items = POSTS.slice(offset, offset + limit);
  res.json({
    total: POSTS.length,
    limit,
    offset,
    items,
  });
});

/** 2) 글 단건 조회
 *  - GET /api/v1/posts/:id
 */
router.get("/:id", (req, res) => {
  const post = POSTS.find(p => String(p.id) === String(req.params.id));
  if (!post) return res.status(404).json({ error: { code: "NOT_FOUND", message: "post not found" } });
  res.json(post);
});

/** 3) 글 작성
 *  - POST /api/v1/posts
 *  - Body (JSON): { content, images?, videos?, tags?, location? }
 */
router.post("/", (req, res) => {
  const { content = "", images = [], videos = [], tags = [], location = null } = req.body ?? {};
  if (!content.trim()) {
    return res.status(400).json({
      error: { code: "BAD_REQUEST", message: "content required" },
    });
  }

  const post = {
    id: crypto.randomUUID(),
    content: content.trim(),
    images: Array.isArray(images) ? images : [],
    videos: Array.isArray(videos) ? videos : [],
    tags: Array.isArray(tags) ? tags : [],
    location: location ?? null, // { lat, lng } 같은 객체를 기대
    created_at: new Date().toISOString(),
  };

  // 최신글이 앞으로 오도록
  POSTS.unshift(post);
  res.status(201).json(post);
});

export default router;
