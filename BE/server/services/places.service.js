import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const LABELS = {
  recommend: "추천",
  popular: "인기",
  event: "동네행사",
  food: "맛집",
  cafe: "카페",
  mart: "마트",
};

// 간단 난수(시드 고정용)
function prng(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

/** ─────────────────────────────────────────────
 *  좌표→주소 (역지오코딩)
 *  MAP_PROVIDER=google 이고 GOOGLE_MAPS_API_KEY 가 있으면
 *  구글로 실제 주소를 받아온다.
 *  실패하면 " (lat,lng) 근처 " 같은 안전 문구를 반환.
 *  ──────────────────────────────────────────── */
export async function reverseGeocode({ lat, lng }) {
  const provider = (process.env.MAP_PROVIDER || "kakao").toLowerCase();

  // 0) Google (권장)
  if (provider === "google" && process.env.GOOGLE_MAPS_API_KEY) {
    const url = "https://maps.googleapis.com/maps/api/geocode/json";
    const res = await axios.get(url, {
      params: { latlng: `${lat},${lng}`, key: process.env.GOOGLE_MAPS_API_KEY, language: "ko" },
      timeout: 4000,
    });
    const r0 = res.data?.results?.[0];
    const addr = r0?.formatted_address;
    if (addr) return addr;

    // 주소가 비어 있으면 행정구역 조합 시도
    const c = r0?.address_components || [];
    const pick = (t) => c.find(x => x.types?.includes(t))?.long_name || "";
    const a1 = pick("administrative_area_level_1");
    const a2 = pick("administrative_area_level_2");
    const a3 = pick("sublocality") || pick("locality");
    const fallback = `${a1} ${a2} ${a3}`.trim();
    if (fallback) return fallback;
  }

  // 1) Kakao (옵션)
  if (provider === "kakao" && process.env.KAKAO_REST_KEY) {
    const url = "https://dapi.kakao.com/v2/local/geo/coord2address.json";
    const res = await axios.get(url, {
      params: { x: lng, y: lat },
      headers: { Authorization: `KakaoAK ${process.env.KAKAO_REST_KEY}` },
      timeout: 4000,
    });
    const doc = res.data?.documents?.[0];
    const addr = doc?.road_address?.address_name || doc?.address?.address_name;
    if (addr) return addr;
  }

  // 2) Naver (옵션)
  if (
    provider === "naver" &&
    process.env.NAVER_CLIENT_ID &&
    process.env.NAVER_CLIENT_SECRET
  ) {
    const url = "https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc";
    const res = await axios.get(url, {
      params: { coords: `${lng},${lat}`, orders: "roadaddr,addr,admcode", output: "json" },
      headers: {
        "X-NCP-APIGW-API-KEY-ID": process.env.NAVER_CLIENT_ID,
        "X-NCP-APIGW-API-KEY": process.env.NAVER_CLIENT_SECRET,
      },
      timeout: 4000,
    });
    const r0 = res.data?.results?.[0];
    const area = r0?.region;
    if (area) {
      const a1 = area.area1?.name || "";
      const a2 = area.area2?.name || "";
      const a3 = area.area3?.name || "";
      return `${a1} ${a2} ${a3}`.trim();
    }
  }

  // 3) 모두 실패하면 안전한 문구
  return lat && lng ? `(${lat.toFixed(4)}, ${lng.toFixed(4)}) 근처` : "우리동네";
}

/** 주소→좌표 (정방향 geocoding: 검색용) */
export async function forwardGeocode(query) {
  // 지금은 구글만 지원
  if (process.env.GOOGLE_MAPS_API_KEY) {
    const url = "https://maps.googleapis.com/maps/api/geocode/json";
    const res = await axios.get(url, {
      params: { address: query, key: process.env.GOOGLE_MAPS_API_KEY, language: "ko", region: "kr" },
      timeout: 4000,
    });
    const r0 = res.data?.results?.[0];
    if (!r0) return null;
    return {
      formattedAddress: r0.formatted_address,
      lat: r0.geometry?.location?.lat,
      lng: r0.geometry?.location?.lng,
      placeId: r0.place_id,
    };
  }
  return null;
}

/** 목록 생성 (프론트 카드/리스트용) */
export async function buildPlaceList({
  category,
  lat,
  lng,
  region, // 사용자가 고른 지역명(옵션)
  page,
  limit,
  seed,
}) {
  const LABEL = {
    recommend: "추천",
    popular:   "인기",
    event:     "동네행사",
    food:      "맛집",
    cafe:      "카페",
    mart:      "마트",
  };
  const label = LABEL[category] || LABEL.recommend;

  // 주소 문구 만들기: region 우선 → 없으면 역지오코딩 → 기본
  let baseAddress = region;
  if (!baseAddress && lat != null && lng != null) {
    try { baseAddress = await reverseGeocode({ lat, lng }); }
    catch { baseAddress = `(${lat.toFixed(4)}, ${lng.toFixed(4)}) 근처`; }
  }
  if (!baseAddress) baseAddress = "우리동네";

  const items = [];
  const base = (page - 1) * limit;

  for (let i = 0; i < limit; i++) {
    const id = base + i + 1;
    const s = (seed ?? 777) + i;
    const jitter = () => (prng(s) - 0.5) * 0.02; // 중심 근처로 살짝 흩뿌리기
    const dist = Math.round(((i + 1) * 0.6 + prng(s)) * 10) / 10;

    items.push({
      id: `${category}-${id}`,
      name: `${label} 스팟 ${id}`,
      distanceKm: dist,
      address: `${baseAddress} ${id}`,     // 이제 여기 주소가 구글에서 온 '진짜 주소'
      lat: (lat ?? 37.5665) + jitter(),    // 중심 없으면 서울시청 근방
      lng: (lng ?? 126.9780) + jitter(),
      thumbnail: `https://picsum.photos/seed/${category}-${id}/120/80`,
      tags: [label],
    });
  }

  const hasMore = page < 4; // 데모 제한
  return { page, limit, hasMore, items };
}
