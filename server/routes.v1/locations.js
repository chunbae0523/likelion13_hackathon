// server/routes.v1/locations.js
import { Router } from "express";

const router = Router();

// ---- Mock 데이터 ----
const SIDOS = [
  { id: "11", name: "서울특별시" },
  { id: "26", name: "부산광역시" },
];

const GUGUNS = {
  "11": [ // 서울
    { id: "110", name: "강남구" },
    { id: "140", name: "송파구" },
  ],
  "26": [ // 부산
    { id: "260", name: "해운대구" },
  ],
};

const DONGS = {
  "110": [ // 강남구
    { id: "1101", name: "역삼동" },
    { id: "1102", name: "대치동" },
  ],
  "140": [ // 송파구
    { id: "1401", name: "잠실동" },
  ],
  "260": [ // 해운대구
    { id: "2601", name: "우동" },
  ],
};

// ---- 시/도 목록 ----
// GET /api/v1/locations/sido
router.get("/sido", (_req, res) => {
  res.json({ items: SIDOS });
});

// ---- 구/군 목록 ----
// GET /api/v1/locations/sido/:sidoId/gugun
router.get("/sido/:sidoId/gugun", (req, res) => {
  const { sidoId } = req.params;
  res.json({ sidoId, items: GUGUNS[sidoId] || [] });
});

// ---- 동/읍/면 목록 ----
// GET /api/v1/locations/gugun/:gugunId/dong
router.get("/gugun/:gugunId/dong", (req, res) => {
  const { gugunId } = req.params;
  res.json({ gugunId, items: DONGS[gugunId] || [] });
});

// ---- 통합 키워드 검색(시/도, 구/군, 동) ----
// GET /api/v1/locations/search?keyword=서울특별시
router.get("/search", (req, res) => {
  const q = String(req.query.keyword || "").trim();
  if (!q) return res.json({ items: [] });

  const sidoMatches = SIDOS
    .filter(s => s.name.includes(q))
    .map(s => ({ type: "sido", sidoId: s.id, label: s.name }));

  const gugunMatches = Object.entries(GUGUNS).flatMap(([sidoId, list]) =>
    list
      .filter(g => g.name.includes(q))
      .map(g => ({ type: "gugun", sidoId, gugunId: g.id, label: g.name }))
  );

  const dongMatches = Object.entries(DONGS).flatMap(([gugunId, list]) =>
    list
      .filter(d => d.name.includes(q))
      .map(d => ({ type: "dong", gugunId, dongId: d.id, label: d.name }))
  );

  res.json({ items: [...sidoMatches, ...gugunMatches, ...dongMatches] });
});

export default router;
