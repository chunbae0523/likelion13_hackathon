// 가짜 <-> 진짜 스위칭
import Constants from "expo-constants";
import apiClient from "./apiClient";
import type { Place } from "../types/place";
import { fakeFetchMapStores, fakeFetchPlacesByCategory } from "./__fake__/map";

// 환경설정에서 스위치 값을 읽는다. 없으면 기본 true(가짜 사용)
const USE_FAKE =
  (Constants.expoConfig?.extra as any)?.USE_FAKE_MAP ?? true;

// 실제 백엔드 명세 경로
// 1) 주변 가게: /api/v1/map/stores?lat={위도}&lng={경도}&radius=3km
// 2) 카테고리: /api/v1/places/category={키}
const MAP_STORES_PATH = "/api/v1/map/stores";
const CATEGORY_PATH = (category: string) => `/api/v1/places/category=${category}`;

// 주변 가게 조회
export async function getMapStores(
  lat: number,
  lng: number,
  radius: string | number = "3km"
): Promise<Place[]> {
  if (USE_FAKE) {
    return fakeFetchMapStores({ lat, lng, radius });
  }
  const { data } = await apiClient.get(MAP_STORES_PATH, {
    params: { lat, lng, radius },
  });
  // 백엔드 응답 형태가 배열이 아닐 수도 있으니 안전하게 꺼낸다.
  return Array.isArray(data) ? data : data?.items ?? data?.content ?? [];
}

// 카테고리별 조회
export async function getPlacesByCategory(category: string): Promise<Place[]> {
  if (USE_FAKE) {
    return fakeFetchPlacesByCategory(category);
  }
  const { data } = await apiClient.get(CATEGORY_PATH(category));
  return Array.isArray(data) ? data : data?.items ?? data?.content ?? [];
}