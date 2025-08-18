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

// ── 역지오코딩: 좌표 → 주소 문자열 ──────────────────────────
async function reverseGeocode({ lat, lng }) {
  const provider = (process.env.MAP_PROVIDER || "kakao").toLowerCase();

  // 1) 카카오
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

  // 2) 네이버
  if (
    provider === "naver" &&
    process.env.NAVER_CLIENT_ID &&
    process.env.NAVER_CLIENT_SECRET
  ) {
    const url =
      "https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc";
    const res = await axios.get(url, {
      params: {
        coords: `${lng},${lat}`,
        orders: "roadaddr,addr,admcode",
        output: "json",
      },
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

  // 3) 키가 없거나 실패한 경우: 좌표 근처 표시
  return lat && lng ? `(${lat.toFixed(4)}, ${lng.toFixed(4)}) 근처` : "우리동네";
}

// ── 메인 생성 로직 ────────────────────────────────────────
export async function buildPlaceList({
  category,
  lat,
  lng,
  region,      // 사용자가 검색에서 고른 지역명 문자열(옵션)
  page,
  limit,
  seed,
}) {
  const label = LABELS[category] || LABELS.recommend;

  // 주소의 "기준 문구"를 결정: region 우선 → 없으면 역지오코딩 → 그래도 없으면 기본
  let baseAddress = region;
  if (!baseAddress && lat != null && lng != null) {
    try {
      baseAddress = await reverseGeocode({ lat, lng });
    } catch {
      baseAddress = lat && lng ? `(${lat.toFixed(4)}, ${lng.toFixed(4)}) 근처` : "우리동네";
    }
  }
  if (!baseAddress) baseAddress = "우리동네";

  const items = [];
  const base = (page - 1) * limit;

  for (let i = 0; i < limit; i++) {
    const id = base + i + 1;
    const s = (seed ?? 777) + i; // seed 없으면 777 기준
    const jitter = () => (prng(s) - 0.5) * 0.02; // 근처 좌표 산출
    const dist = Math.round(((i + 1) * 0.6 + prng(s)) * 10) / 10;

    items.push({
      id: `${category}-${id}`,
      name: `${label} 스팟 ${id}`,
      distanceKm: dist,
      address: `${baseAddress} ${id}`,      // ← 주소 문구가 여기서 결정됨
      lat: (lat ?? 37.5665) + jitter(),     // lat/lng 없으면 서울 시청 근방
      lng: (lng ?? 126.9780) + jitter(),
      thumbnail: `https://picsum.photos/seed/${category}-${id}/120/80`,
      tags: [label],
    });
  }

  // 데모: 4페이지까지만 존재하는 것으로
  const hasMore = page < 4;

  return { page, limit, hasMore, items };
}



