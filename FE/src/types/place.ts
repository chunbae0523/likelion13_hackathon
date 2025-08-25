// src/types/place.ts
// 지도에 표시할 장소의 화면용 타입
export type Place = {
  id: string;
  title: string;
  lat: number;            // 위도
  lng: number;            // 경도
  address?: string;
  distanceKm?: number;    // 현재 중심 기준 거리(km)
  openNowText?: string;
  reviewSummary?: string;
  signatureMenuText?: string;
  tags?: string[];        // ["추천","인기","카페","맛집","동네행사","마트"] 등
};