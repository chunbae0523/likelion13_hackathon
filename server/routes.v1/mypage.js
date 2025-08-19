// routes.v1/mypage.js
import express from "express";
import { pool } from "../db.js";
import { fakeAuth } from "../middlewares/fakeAuth.js";

const router = express.Router();

/* ---------------------------------------------
 * 공통: 유틸
 * ------------------------------------------- */
async function assertMyStore(ownerId, storeId) {
  const [rows] = await pool.query(
    "SELECT id FROM stores WHERE id = ? AND owner_id = ?",
    [storeId, ownerId]
  );
  if (rows.length === 0) {
    const err = new Error("이 가게의 주인이 아니에요.");
    err.status = 403;
    throw err;
  }
}

/* ---------------------------------------------
 * [마이페이지-주민]
 * ------------------------------------------- */

// 내정보 GET /users/me
router.get("/me", fakeAuth, async (req, res) => {
  try {
    const userId = req.user.id;

    const [[user]] = await pool.query(
      `SELECT id, email, nickname, avatar_url, role, neighborhood, \'language\', created_at
       FROM users WHERE id = ?`,
      [userId]
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    // 내가 작성한 게시물 수
    const [[postCnt]] = await pool.query(
      "SELECT COUNT(*) AS cnt FROM places WHERE user_id = ?",
      [userId]
    );

    //   place_likes 테이블 없이: 내가 쓴 글들의 likes 합계
    //   (likes 컬럼이 없다면 0으로 처리)
    let likeSum = 0;
    try {
      const [[row]] = await pool.query(
        "SELECT COALESCE(SUM(likes), 0) AS cnt FROM places WHERE user_id = ?",
        [userId]
      );
      likeSum = row.cnt ?? 0;
    } catch (err) {
      // likes 컬럼이 없으면 ER_BAD_FIELD_ERROR 발생 → 0으로 처리
      if (err.code !== "ER_BAD_FIELD_ERROR") throw err;
    }

    res.json({
      message: "success",
      user,
      stats: { posts: postCnt.cnt, likes: likeSum },
      insights_url: user.role === "owner" ? `/insights?ownerId=${userId}` : null,
    });
  } catch (e) {
    console.error(e);
    res.status(e.status || 500).json({ message: e.message || "DB error" });
  }
});

// 내가 좋아요한 글 GET /users/me/likes
//    place_likes(사용자별 좋아요 기록) 테이블이 없으므로
//    현재는 빈 배열과 안내 메시지를 반환합니다.
//    *정말* 이 기능이 필요하면 "누가 무엇을 좋아요했는지" 저장하는 테이블이 필수입니다.
router.get("/me/likes", fakeAuth, async (_req, res) => {
  res.json({
    message:
      "개인별 좋아요 기록 테이블이 없어 빈 목록을 반환합니다. ",
    likes: [],
  });
});

// 내가 쓴 댓글 GET /users/me/comments
router.get("/me/comments", fakeAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await pool.query(
      `SELECT c.id AS comment_id, c.content, c.created_at,
              p.id AS place_id, p.title
       FROM place_comments c
       JOIN places p ON p.id = c.place_id
       WHERE c.user_id = ?
       ORDER BY c.id DESC`,
      [userId]
    );
    res.json({ message: "success", comments: rows });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "DB error" });
  }
});

// 스크랩 GET /users/me/scraps
router.get("/me/scraps", fakeAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await pool.query(
      `SELECT b.id AS bookmark_id, p.id AS place_id, p.title, p.thumbnail_url, b.created_at
       FROM bookmarks b
       JOIN places p ON p.id = b.place_id
       WHERE b.user_id = ?
       ORDER BY b.id DESC`,
      [userId]
    );
    res.json({ message: "success", scraps: rows });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "DB error" });
  }
});

// 내가 작성한 소문 GET /users/me/posts
router.get("/me/posts", fakeAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await pool.query(
      `SELECT id, title, content, thumbnail_url, created_at, 
              COALESCE(likes, 0) AS likes
       FROM places
       WHERE user_id = ?
       ORDER BY id DESC`,
      [userId]
    );
    res.json({ message: "success", posts: rows });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "DB error" });
  }
});

// 최근 본 소문 GET /users/me/recent
router.get("/me/recent", fakeAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await pool.query(
      `SELECT
         x.place_id,
         p.title,
         p.thumbnail_url,
         x.last_viewed_at
       FROM (
         SELECT place_id, MAX(created_at) AS last_viewed_at
         FROM recent_views
         WHERE user_id = ?
         GROUP BY place_id
       ) AS x
       JOIN places p ON p.id = x.place_id
       ORDER BY x.last_viewed_at DESC
       LIMIT 50`,
      [userId]
    );
    res.json({ message: "success", recent: rows });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "DB error" });
  }
});


// 내 정보 수정 PATCH /users/me
router.patch("/me", fakeAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { nickname, avatar_url, neighborhood, language } = req.body;

    await pool.query(
      `UPDATE users
         SET nickname    = COALESCE(?, nickname),
             avatar_url  = COALESCE(?, avatar_url),
             neighborhood= COALESCE(?, neighborhood),
             \'language\'    = COALESCE(?, \'language\')
       WHERE id = ?`,
      [nickname ?? null, avatar_url ?? null, neighborhood ?? null, language ?? null, userId]
    );

    const [[user]] = await pool.query(
      `SELECT id, email, nickname, avatar_url, role, neighborhood, language, created_at
       FROM users WHERE id = ?`,
      [userId]
    );
    res.json({ message: "updated", user });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "DB error" });
  }
});

// 1) 내 동네 조회: GET /api/v1/users/me/neighborhood
router.get("/me/neighborhood", fakeAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const [[row]] = await pool.query(
      "SELECT neighborhood FROM users WHERE id = ?",
      [userId]
    );
    res.json({ neighborhood: row?.neighborhood || null });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "DB error" });
  }
});

// 2) 내 동네 저장: PUT /api/v1/users/me/neighborhood
// Body: { "neighborhood": "연수구" }
router.put("/me/neighborhood", fakeAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { neighborhood } = req.body || {};
    if (!neighborhood) {
      return res.status(400).json({ message: "neighborhood required" });
    }
    await pool.query(
      "UPDATE users SET neighborhood = ? WHERE id = ?",
      [neighborhood, userId]
    );
    res.json({ ok: true, neighborhood });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "DB error" });
  }
});

/* ---------------------------------------------
 * [마이페이지-사장님]
 * ------------------------------------------- */

// 내가 운영하는 가게 정보 GET /users/me/stores
router.get("/me/stores", fakeAuth, async (req, res) => {
  try {
    const ownerId = req.user.id;
    const [rows] = await pool.query(
      `SELECT id, name, address, phone, description, thumbnail_url, created_at
       FROM stores
       WHERE owner_id = ?
       ORDER BY id DESC`,
      [ownerId]
    );

    const stores = rows.map((s) => ({
      ...s,
      insights_url: `/insights?storeId=${s.id}`, // 프론트 버튼 연결용
    }));

    res.json({ message: "success", stores });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "DB error" });
  }
});

// 가게 정보 수정 PATCH /stores/{store_id}
router.patch("/stores/:store_id", fakeAuth, async (req, res) => {
  try {
    const ownerId = req.user.id;
    const storeId = Number(req.params.store_id);

    await assertMyStore(ownerId, storeId);

    const { name, address, phone, description, thumbnail_url } = req.body;

    await pool.query(
      `UPDATE stores
         SET name = COALESCE(?, name),
             address = COALESCE(?, address),
             phone = COALESCE(?, phone),
             description = COALESCE(?, description),
             thumbnail_url = COALESCE(?, thumbnail_url)
       WHERE id = ?`,
      [name ?? null, address ?? null, phone ?? null, description ?? null, thumbnail_url ?? null, storeId]
    );

    const [[store]] = await pool.query(
      `SELECT id, name, address, phone, description, thumbnail_url, created_at
       FROM stores WHERE id = ?`,
      [storeId]
    );
    res.json({ message: "updated", store });
  } catch (e) {
    console.error(e);
    res.status(e.status || 500).json({ message: e.message || "DB error" });
  }
});

// 가게 리뷰 목록 GET /stores/{store_id}/reviews
router.get("/stores/:store_id/reviews", fakeAuth, async (req, res) => {
  try {
    const storeId = Number(req.params.store_id);

    const [rows] = await pool.query(
      `SELECT r.id, r.user_id, u.nickname AS user_nickname,
              r.rating, r.content, r.created_at
       FROM store_reviews r
       JOIN users u ON u.id = r.user_id
       WHERE r.store_id = ?
       ORDER BY r.id DESC`,
      [storeId]
    );
    res.json({ message: "success", reviews: rows });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "DB error" });
  }
});

// 가게 리뷰 삭제 DELETE /stores/{store_id}/reviews/{review_id}
router.delete("/stores/:store_id/reviews/:review_id", fakeAuth, async (req, res) => {
  try {
    const ownerId = req.user.id;
    const storeId = Number(req.params.store_id);
    const reviewId = Number(req.params.review_id);

    await assertMyStore(ownerId, storeId);

    await pool.query(
      "DELETE FROM store_reviews WHERE id = ? AND store_id = ?",
      [reviewId, storeId]
    );

    res.json({ message: "deleted" });
  } catch (e) {
    console.error(e);
    res.status(e.status || 500).json({ message: e.message || "DB error" });
  }
});

export default router;
