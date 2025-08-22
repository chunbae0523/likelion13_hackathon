import { Router } from "express";
import { buildPlaceList } from "../services/places.service.js";

const router = Router();

/**
 * GET /api/v1/places
 * query:
 *  - category: recommend|popular|event|food|cafe|mart (default: recommend)
 *  - lat,lng: 중심 좌표 (버튼/검색에서 넘어온 값)  ※ lat,lng 둘 중 하나라도 있으면 사용
 *  - region: "서울특별시 강남구" 같은 선택 지역명 (옵션)
 *  - page: 기본 1
 *  - limit: 기본 3
 *  - seed: 새로고침용 (숫자 바꾸면 다른 3곳)
 */
router.get("/", async (req, res) => {
  const {
    category = "recommend",
    lat,
    lng,
    region,
    page = 1,
    limit = 3,
    seed,
  } = req.query;

  // lat/lng와 region이 모두 없으면 의미 있는 검색이 어려우므로 400
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
    res.status(500).json({ error: "places 처리 중 오류", detail: String(e) });
  }
});

export default router;
