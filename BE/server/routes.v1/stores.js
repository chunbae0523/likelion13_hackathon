// server/routes.v1/stores.js
import { Router } from "express";
import { MOCK_STORES } from "../_mock.js";  // ← 경로 주의!

const router = Router();

// 목록: GET /api/v1/stores
router.get("/", (_req, res) => {
  res.json(MOCK_STORES);
});

// 상세: GET /api/v1/stores/:id
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const s = MOCK_STORES.find(v => v.id === id);
  if (!s) return res.status(404).json({ error: "not found" });

  res.json({
    ...s,
    photos: [],
    desc: "우드톤 인테리어가 예쁜 가게에요."
  });
});

export default router;
