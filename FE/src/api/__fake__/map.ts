// 네트워크 없이 가짜 API 데이터 + 함수
import type { Place } from "../../types/place";

// 지도 중심(서울 시청 근처) 근방에 샘플 좌표를 둔다.
const DEFAULT_CENTER = { lat: 37.5665, lng: 126.978 };

// 간단한 거리 계산(Haversine). km 단위로 반환한다.
function distanceKm(aLat: number, aLng: number, bLat: number, bLng: number) {
  const R = 6371; // 지구 반지름(km)
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLng = ((bLng - aLng) * Math.PI) / 180;
  const la1 = (aLat * Math.PI) / 180;
  const la2 = (bLat * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLng / 2) ** 2 * Math.cos(la1) * Math.cos(la2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// UI에서 쓸 목데이터
const fixtures: Place[] = [
  {
    id: "1",
    title: "소문난 카페",
    lat: DEFAULT_CENTER.lat + 0.003,
    lng: DEFAULT_CENTER.lng + 0.002,
    address: "인천광역시 연수구 용담로 135, 지상 1층",
    openNowText: "영업 중",
    reviewSummary: "리뷰 1,942",
    signatureMenuText: "로얄 시그니처 메뉴 말차라떼",
    tags: ["추천", "카페"],
  },
  {
    id: "2",
    title: "연개소문 카페",
    lat: DEFAULT_CENTER.lat - 0.0025,
    lng: DEFAULT_CENTER.lng + 0.004,
    address: "인천광역시 연수구 동춘 1동 985, 지상 2층",
    openNowText: "영업 중",
    reviewSummary: "리뷰 1,514",
    signatureMenuText: "땅콩 크림라떼로 완성하는 휴식",
    tags: ["인기", "카페"],
  },
  {
    id: "3",
    title: "소문이 머문 자리",
    lat: DEFAULT_CENTER.lat - 0.01,
    lng: DEFAULT_CENTER.lng - 0.01,
    address: "인천광역시 연수구 청능대로 89, 지상 1층",
    openNowText: "영업 중",
    reviewSummary: "리뷰 1,106",
    signatureMenuText: "티라미수와 함께하는 커피 타임",
    tags: ["맛집"],
  },
  {
    id: "4",
    title: "동네 벼룩시장",
    lat: DEFAULT_CENTER.lat + 0.012,
    lng: DEFAULT_CENTER.lng - 0.006,
    address: "서울특별시 어딘가",
    openNowText: "오늘만 진행",
    reviewSummary: "리뷰 120",
    signatureMenuText: "현장 이벤트",
    tags: ["동네행사"],
  },
  {
    id: "5",
    title: "우리동네 마트",
    lat: DEFAULT_CENTER.lat - 0.008,
    lng: DEFAULT_CENTER.lng + 0.008,
    address: "서울특별시 어딘가",
    reviewSummary: "리뷰 312",
    tags: ["마트"],
  },
];

// 네트워크 지연 흉내
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// "3km" → 3 숫자만 추출
function parseRadiusKm(input: string | number | undefined) {
  if (typeof input === "number") return input;
  const n = parseFloat(String(input ?? "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 3;
}

// 중심 좌표와 반경으로 목록 조회
export async function fakeFetchMapStores(params: {
  lat: number;
  lng: number;
  radius?: string | number; // "3km" 형태도 허용
}): Promise<Place[]> {
  await sleep(250);
  const km = parseRadiusKm(params.radius);
  return fixtures
    .map((p) => ({
      ...p,
      distanceKm: distanceKm(params.lat, params.lng, p.lat, p.lng),
    }))
    .filter((p) => (p.distanceKm ?? 0) <= km)
    .sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));
}

// 카테고리별 목록 조회
export async function fakeFetchPlacesByCategory(category: string): Promise<Place[]> {
  await sleep(200);
  return fixtures.filter((p) => (p.tags ?? []).includes(category));
}