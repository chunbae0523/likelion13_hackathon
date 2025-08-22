import { Router } from "express";
import { buildPlaceList, forwardGeocode, reverseGeocode } from "../services/places.service.js";

const router = Router();

/** 새로 추가: 좌표 → 주소 (구글 사용) */
router.get("/geocode/reverse", async (req, res) => {
  try {
    const { lat, lng } = req.query;
    if (!lat || !lng) return res.status(400).json({ error: "lat,lng required" });
    const address = await reverseGeocode({ lat: Number(lat), lng: Number(lng) });
    res.json({ address });
  } catch (e) {
    res.status(500).json({ error: "REVERSE_GEOCODE_FAILED", detail: String(e) });
  }
});

/** 새로 추가: 주소 → 좌표 (구글 사용) */
router.get("/geocode/search", async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: "q (address) required" });
    const result = await forwardGeocode(String(q));
    if (!result) return res.status(404).json({ error: "NOT_FOUND" });
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: "FORWARD_GEOCODE_FAILED", detail: String(e) });
  }
});

/** 0) 추천 장소 리스트 (주소는 구글에서 받은 진짜 주소 사용) */
router.get("/places", async (req, res) => {
  const { category = "recommend", lat, lng, region, page = 1, limit = 3, seed } = req.query;
  if ((!lat || !lng) && !region) {
    return res.status(400).json({ error: "lat,lng 또는 region 중 하나는 필요합니다." });
  }
  try {
    const data = await buildPlaceList({
      category,
      lat: lat ? Number(lat) : undefined,
      lng: lng ? Number(lng) : undefined,
      region: region || undefined,
      page: Number(page),
      limit: Number(limit),
      seed: seed != null ? Number(seed) : undefined,
    });
    res.json(data);
  } catch (e) {
    console.error("[/map/places] failed:", e?.response?.data || e.message);
    res.status(500).json({ error: "PLACES_FAILED" });
  }
});

/** 1) 주변 가게(모의) */
router.get("/stores", (req, res) => {
  // ... (네 기존 코드 그대로)
});

/** 2) 지도 게시글(모의) */
router.get("/posts", (req, res) => {
  // ... (네 기존 코드 그대로)
});

/** 3) 인사이트(OpenAI) */
router.get("/insights", async (req, res) => {
  // ... (네 기존 코드 그대로, chat deployment만 env에서 읽도록 되어 있음)
});

export default router;
