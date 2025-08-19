// routes.v1/users.js
import { Router } from "express";
import pool from "../db.js";
import fakeAuth from "../middlewares/fakeAuth.js";

const router = Router();

/** ---------------- 검색(기존) ---------------- */
router.get("/search", async (req, res) => {
  const { keyword = "" } = req.query;
  const users = [
    { id:"u1", name:"김민수", handle:"minsu" },
    { id:"u2", name:"박서연", handle:"seoyeon" },
    { id:"u3", name:"이현우", handle:"hyunwoo" },
  ].filter(u => u.name.includes(keyword) || u.handle.includes(keyword));
  res.json({ items: users });
});

/** ---------------- 내 정보(DB) ---------------- */
// GET /api/v1/users/me
router.get("/me", fakeAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await pool.query(
      `SELECT id, email, nickname, avatar_url, role, neighborhood, \`language\`
       FROM users WHERE id = ?`,
      [userId]
    );
    if (rows.length === 0) return res.status(404).json({ message: "not found" });
    res.set("Content-Language", rows[0].language ?? "ko");
    res.json({ message: "success", me: rows[0] });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "DB error" });
  }
});

/** ---------------- 언어 조회/변경 ---------------- */
// (선택) GET /api/v1/users/me/language
router.get("/me/language", fakeAuth, async (req, res) => {
  try {
    const [[row]] = await pool.query(
      `SELECT \`language\` FROM users WHERE id = ?`,
      [req.user.id]
    );
    if (!row) return res.status(404).json({ message: "not found" });
    res.set("Content-Language", row.language ?? "ko");
    res.json({ language: row.language ?? "ko" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "DB error" });
  }
});

// PATCH /api/v1/users/me/language  Body: { "language": "ko" | "en" }
router.patch("/me/language", fakeAuth, async (req, res) => {
  try {
    const { language } = req.body; // "ko" | "en"
    const ALLOWED = new Set(["ko", "en"]);
    if (!ALLOWED.has(language)) {
      return res.status(400).json({ message: "invalid language" });
    }
    await pool.query(
      `UPDATE users SET \`language\` = ? WHERE id = ?`,
      [language, req.user.id]
    );
    res.set("Content-Language", language);
    res.json({ message: "updated", language });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "DB error" });
  }
});

/** ---------------- 기타 내 활동(원래 있던 목 API 유지) ---------------- */
router.get("/me/likes", (_req, res) => res.json({ items: [] }));
router.get("/me/comments", (_req, res) => res.json({ items: [] }));
router.get("/me/scraps", (_req, res) => res.json({ items: [] }));
router.get("/me/posts", (_req, res) => res.json({ items: [] }));
router.get("/me/recent", (_req, res) => res.json({ items: [] }));

// (선택) 프로필 일부 수정
router.patch("/me", fakeAuth, async (req, res) => {
  const { nickname, neighborhood } = req.body ?? {};
  try {
    if (nickname)
      await pool.query(`UPDATE users SET nickname=? WHERE id=?`, [nickname, req.user.id]);
    if (neighborhood)
      await pool.query(`UPDATE users SET neighborhood=? WHERE id=?`, [neighborhood, req.user.id]);
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "DB error" });
  }
});

export default router;
