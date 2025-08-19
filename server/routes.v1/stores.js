// server/routes.v1/stores.js
import { Router } from "express";
import { MOCK_STORES } from "../_mock.js";
import pool from "../db.js"; // ← mysql2/promise 풀

const router = Router();

// ---------------- 기존 라우트 ----------------
router.get("/", (_req, res) => {
  res.json(MOCK_STORES);
});

router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const s = MOCK_STORES.find(v => v.id === id);
  if (!s) return res.status(404).json({ error: "not found" });

  res.json({ ...s, photos: [], desc: "우드톤 인테리어가 예쁜 가게에요." });
});

// ---------------- 추가: 리뷰 목록 ----------------
// GET /api/v1/stores/:storeId/reviews
router.get("/:storeId/reviews", async (req, res) => {
  try {
    const storeId = Number(req.params.storeId);
    const [rows] = await pool.query(
      `SELECT r.id, r.rating, r.content, r.created_at,
              u.nickname AS author, u.avatar_url
       FROM store_reviews r
       JOIN users u ON u.id = r.user_id
       WHERE r.store_id = ?
       ORDER BY r.created_at DESC`,
      [storeId]
    );
    res.json({ message: "success", reviews: rows });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "DB error" });
  }
});

// ---------------- 추가: 리뷰 단건 ----------------
// GET /api/v1/stores/:storeId/reviews/:reviewId
router.get("/:storeId/reviews/:reviewId", async (req, res) => {
  try {
    const storeId = Number(req.params.storeId);
    const reviewId = Number(req.params.reviewId);
    const [rows] = await pool.query(
      `SELECT r.id, r.rating, r.content, r.created_at,
              u.nickname AS author, u.avatar_url
       FROM store_reviews r
       JOIN users u ON u.id = r.user_id
       WHERE r.store_id = ? AND r.id = ?`,
      [storeId, reviewId]
    );
    if (rows.length === 0) return res.status(404).json({ message: "not found" });
    res.json({ message: "success", review: rows[0] });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "DB error" });
  }
});

export default router;

