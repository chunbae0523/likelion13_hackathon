
// server/routes.v1/map.js
import { Router } from "express";
import axios from "axios";

const router = Router();

// 간단 mock 데이터
const MOCK_STORES = [
  { id: "s1", name: "치킨집 A", lat: 37.501, lng: 127.001 },
  { id: "s2", name: "카페 B",   lat: 37.499, lng: 126.999 },
  { id: "s3", name: "분식 C",   lat: 37.503, lng: 127.002 },
];

const MOCK_POSTS = [
  { id: "p1", storeId: "s1", content: "주말 30% 할인!" },
  { id: "p2", storeId: "s2", content: "신메뉴 라떼 출시" },
  { id: "p3", storeId: "s3", content: "떡볶이 1+1 이벤트" },
];

// Haversine 거리 (km)
function distKm(lat1,lng1,lat2,lng2){
  const R=6371; const dLat=(lat2-lat1)*Math.PI/180; const dLng=(lng2-lng1)*Math.PI/180;
  const a=Math.sin(dLat/2)**2+Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
  return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
}

/** 1) 지도 주변 가게 목록 */
router.get("/stores", (req, res) => {
  const { lat, lng, radius = "3km" } = req.query;
  if (!lat || !lng) return res.status(400).json({ error: "lat,lng required" });
  const R = Number(String(radius).replace(/km$/,"")) || 3;
  const center = { lat:Number(lat), lng:Number(lng) };

  const items = MOCK_STORES
    .map(s => ({ ...s, distance_km: Number(distKm(center.lat, center.lng, s.lat, s.lng).toFixed(3)) }))
    .filter(s => s.distance_km <= R)
    .sort((a,b)=>a.distance_km-b.distance_km);

  res.json({ center, radius, items });
});

/** 2) 지도에 표시할 게시글 */
router.get("/posts", (req, res) => {
  const { lat, lng } = req.query;
  if (!lat || !lng) return res.status(400).json({ error: "lat,lng required" });
  const center = { lat:Number(lat), lng:Number(lng) };

  // 간단히 가게 좌표를 붙여 반환
  const items = MOCK_POSTS.map(p => {
    const s = MOCK_STORES.find(x => x.id === p.storeId);
    return s ? { ...p, lat: s.lat, lng: s.lng } : p;
  });

  res.json({ center, items });
});

/** 3) 인사이트 */
router.get("/insights", async (req, res) => {
  try {
    const { lat, lng, radius = "3km" } = req.query;
    if (!lat || !lng) return res.status(400).json({ error: "lat,lng required" });

    // 내부 API에서 데이터 모으기 (위의 2개가 반드시 200이어야 함!)
    const base = `${req.protocol}://${req.get("host")}/api/v1/map`;
    const [storesResp, postsResp] = await Promise.all([
      axios.get(`${base}/stores`, { params: { lat, lng, radius } }),
      axios.get(`${base}/posts`,  { params: { lat, lng } })
    ]);

    const stores = storesResp.data.items || [];
    const posts  = postsResp.data.items || [];

    const prompt = `
너는 데이터 분석 도우미야.
아래 데이터로 JSON만 반환해.

필드:
1) nearest_stores: 거리 상위 3곳 {id,name,distance_km}
2) post_summaries: 게시글 요약 3개 [{id, summary}]
3) suggestions: 상점 홍보문구 3개 (짧게)
4) hashtags: 해시태그 5개 (공백 없이)

반드시 JSON만:
{
  "nearest_stores": [],
  "post_summaries": [],
  "suggestions": [],
  "hashtags": []
}

STORES_JSON:
${JSON.stringify(stores).slice(0, 15000)}

POSTS_JSON:
${JSON.stringify(posts).slice(0, 15000)}
    `.trim();

    // Azure OpenAI 호출
    const endpoint   = (process.env.AZURE_OPENAI_ENDPOINT || "").replace(/\/+$/,"");
    const apiKey     = process.env.AZURE_OPENAI_KEY;
    const apiVersion = process.env.AZURE_OPENAI_API_VERSION || "2024-02-01";
    const deployment = process.env.AZURE_OPENAI_CHAT_DEPLOYMENT; // 예: my-gpt-4o-mini

    if (!endpoint || !apiKey || !deployment) {
      return res.status(500).json({ error: "AZURE_ENV_NOT_SET" });
    }

    const chatUrl = `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;
    let chatResp;
    try {
      chatResp = await axios.post(
        chatUrl,
        {
          messages: [
            { role: "system", content: "You are a helpful data analysis assistant. Always return VALID JSON only." },
            { role: "user", content: prompt }
          ],
          temperature: 0.2,
          max_tokens: 600
        },
        { headers: { "api-key": apiKey, "Content-Type": "application/json" } }
      );
    } catch (e) {
      console.error("[AZURE CHAT ERROR]", e?.response?.status, e?.response?.data || e.message);
      return res.status(502).json({ error: "AZURE_CHAT_REQUEST_FAILED" });
    }

    const text = chatResp.data?.choices?.[0]?.message?.content || "{}";
    let insights;
    try { insights = JSON.parse(text); }
    catch { insights = { raw: text }; }

    return res.json({ center: { lat:Number(lat), lng:Number(lng) }, insights });

  } catch (e) {
    console.error("[INSIGHTS_FAILED]", e?.response?.status, e?.response?.data || e.message);
    res.status(500).json({ error: "INSIGHTS_FAILED" });
  }
});

export default router;
