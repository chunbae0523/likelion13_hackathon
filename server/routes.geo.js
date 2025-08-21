// routes.geo.js
import { Router } from "express";
import axios from "axios";

const router = Router();

function distanceMeters(lat1, lng1, lat2, lng2) {
  const R = 6371e3;
  const toRad = d => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/** GET /geo/nearby?lat=...&lng=...&q=카페 */
router.get("/nearby", async (req, res) => {
  try {
    const { lat, lng, q = "가게" } = req.query;
    if (!lat || !lng) return res.status(400).json({ error: "lat,lng required" });

    const KAKAO_KEY = process.env.KAKAO_REST_API_KEY;

    if (KAKAO_KEY) {
      try {
        const url = "https://dapi.kakao.com/v2/local/search/keyword.json";
        const resp = await axios.get(url, {
          params: { query: q, x: lng, y: lat, radius: 2000, size: 10 },
          headers: { Authorization: `KakaoAK ${KAKAO_KEY}` },
        });

        const items = (resp.data.documents || [])
          .map((d) => ({
            id: d.id,
            name: d.place_name,
            address: d.road_address_name || d.address_name,
            lat: Number(d.y),
            lng: Number(d.x),
            phone: d.phone || "",
            distance: distanceMeters(Number(lat), Number(lng), Number(d.y), Number(d.x)),
            category: d.category_name,
          }))
          .sort((a, b) => a.distance - b.distance);

        return res.json({ base: { lat: Number(lat), lng: Number(lng) }, items });
      } catch (e) {
        // 🔍 카카오 응답/오류를 콘솔에 뿌려서 정확한 원인을 확인
        console.error("Kakao Local API error:",
          e.response?.status,
          e.response?.data || e.message
        );
      }
    }

    // 여기로 오면 (키 없음/카카오 실패) → 샘플 3개로라도 응답
    const baseLat = Number(lat);
    const baseLng = Number(lng);
    const items = [
      { id: "sample-1", name: "은행동 호도과자", lat: baseLat + 0.002, lng: baseLng + 0.001, address: "대전 중구 은행동", category: "베이커리" },
      { id: "sample-2", name: "성심당 카페",   lat: baseLat - 0.001, lng: baseLng + 0.0015, address: "대전 중구",     category: "카페" },
      { id: "sample-3", name: "시장분식",       lat: baseLat + 0.0005, lng: baseLng - 0.001, address: "대전 중구",     category: "분식" },
    ]
      .map((s) => ({ ...s, distance: distanceMeters(baseLat, baseLng, s.lat, s.lng) }))
      .sort((a, b) => a.distance - b.distance);

    return res.json({ base: { lat: baseLat, lng: baseLng }, items });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "nearby error" });
  }
});

export default router;
