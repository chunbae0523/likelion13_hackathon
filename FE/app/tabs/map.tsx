// MapPage.tsx — 가짜 API 연동 완료본
// 1) 지도/리스트 UI는 기존 그대로 유지한다.
// 2) 하드코딩 데이터 대신 API로 가져오도록 교체한다.

import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as Location from "expo-location";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  type Region,
} from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import BottomSheet from "../../components/BottomSheet";
import MapFilterBar, { FilterKey } from "../../components/MapFilterBar";
import PlaceCard from "../../components/PlaceCard";

// 화면에서 사용하는 Place 타입을 로컬 타입 파일에서 가져온다.
// 기존의 "../../../BE/src/types/Place" 경로는 로컬 개발에 불편하므로 교체한다.
import type { Place } from "../../src/types/place";

// 가짜/진짜 스위치가 내부에 구현된 API 모듈
// - getMapStores: 중심좌표+반경으로 장소 목록 조회
// - getPlacesByCategory: 카테고리별 장소 목록 조회
import { getMapStores, getPlacesByCategory } from "../../src/api/mapApi";

const { height: SCREEN_H } = Dimensions.get("window");
const TOP_WHITE_H = 70;
const MAX_SHEET = Math.round(SCREEN_H * 0.8);

// 기본 지도 영역(서울 시청 근처)
const DEFAULT: Region = {
  latitude: 37.5665,
  longitude: 126.978,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

export default function MapPage() {
  const insets = useSafeAreaInsets();

  // 지도/리스트 참조 (카메라 이동, 스크롤 이동 등에 사용)
  const mapRef = useRef<MapView | null>(null);
  const listRef = useRef<FlatList<Place> | null>(null);

  // 바텀시트 확장 여부
  const [expanded, setExpanded] = useState(false);

  // 선택된 필터(카테고리) 목록
  const [filters, setFilters] = useState<FilterKey[]>([]);

  // 서버(가짜/진짜)에서 받아올 장소 데이터
  const [places, setPlaces] = useState<Place[]>([]);

  // 로딩/에러 상태
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 필터가 하나도 없으면 전체, 있으면 태그 포함 항목만 화면에 표시
  const filtered = useMemo(() => {
    if (filters.length === 0) return places;
    return places.filter((p) =>
      (p.tags ?? []).some((t) => filters.includes(t as FilterKey))
    );
  }, [places, filters]);

  // 특정 장소로 카메라를 이동하고, 리스트도 해당 아이템 위치로 스크롤
  const focusPlace = useCallback(
    (p: Place) => {
      mapRef.current?.animateCamera(
        { center: { latitude: p.lat, longitude: p.lng }, zoom: 16 },
        { duration: 300 }
      );
      const idx = filtered.findIndex((x) => x.id === p.id);
      if (idx >= 0)
        listRef.current?.scrollToIndex({ index: idx, animated: true });
    },
    [filtered]
  );

  // 바텀시트가 확장되면 리스트를 맨 위로 이동
  useEffect(() => {
    if (expanded) {
      listRef.current?.scrollToOffset({ offset: 0, animated: true });
    }
  }, [expanded]);

  // 현재 지도 중심 좌표를 얻는다. 없다면 DEFAULT
  const getCurrentCenter = () => {
    const anyMap = mapRef.current as any;
    // __lastRegion은 react-native-maps 내부에서 마지막 region을 보관하는 비공식 필드
    const region: Region | undefined =
      anyMap?.__lastRegion ?? anyMap?.props?.initialRegion;
    return region ?? DEFAULT;
  };

  // 주변 장소 목록을 불러오는 함수
  const fetchAround = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const c = getCurrentCenter();
      const data = await getMapStores(c.latitude, c.longitude, "3km");
      setPlaces(data);
    } catch (e: any) {
      setError(e?.message ?? "목록 불러오기 실패");
    } finally {
      setLoading(false);
    }
  }, []);

  // 카테고리별 목록을 불러오는 함수
  const fetchByCategory = useCallback(async (category: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPlacesByCategory(category);
      setPlaces(data);
    } catch (e: any) {
      setError(e?.message ?? "카테고리 불러오기 실패");
    } finally {
      setLoading(false);
    }
  }, []);

  // 화면 진입 시 한 번 주변 목록을 불러온다.
  useEffect(() => {
    fetchAround();
  }, [fetchAround]);

  // 내 위치로 지도를 이동
  const goToMyLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return;
    const loc = await Location.getCurrentPositionAsync({});
    mapRef.current?.animateCamera(
      {
        center: {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        },
        zoom: 16,
      },
      { duration: 300 }
    );
  };

  return (
    <View style={[{ paddingTop: insets.top }, s.container]}>
      {/* 상단 검색 바 */}
      <View style={s.topWhite}>
        <View style={s.searchBar}>
          <FontAwesome
            name="search"
            size={25}
            style={s.searchIcon}
            color="#C2C2C2"
          />
          <Text style={s.searchPh}>현재 지역 소문 검색하기</Text>
        </View>
      </View>

      {/* 지도 */}
      <View style={s.mapContainer}>
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFillObject}
          provider={PROVIDER_GOOGLE}
          initialRegion={DEFAULT}
          // 필요하다면 onRegionChangeComplete에서 fetchAround를 디바운스하여 호출 가능
        >
          {filtered.map((p) => (
            <Marker
              key={p.id}
              coordinate={{ latitude: p.lat, longitude: p.lng }}
              title={p.title}
              onPress={() => focusPlace(p)}
            >
              <Image
                source={require("../../assets/images/cafe_selected.png")}
                style={{ width: 60, height: 60 }}
                resizeMode="contain"
              />
            </Marker>
          ))}
        </MapView>

        {/* 필터 칩 영역 */}
        <View style={s.chipsOverlay} pointerEvents="box-none">
          <MapFilterBar
            selected={filters}
            onToggle={async (k) => {
              // 단일 선택 모드로 동작: UI 요구사항에 맞게 필요시 복수 선택으로 조정 가능
              setFilters([k]);
              await fetchByCategory(k);
            }}
            gap={6}
            contentPaddingH={0}
          />
        </View>

        {/* 로딩/에러 표시 */}
        {loading && (
          <View
            style={{
              position: "absolute",
              top: TOP_WHITE_H + 8,
              left: 0,
              right: 0,
              alignItems: "center",
            }}
          >
            <Text>불러오는 중...</Text>
          </View>
        )}
        {!!error && (
          <View
            style={{
              position: "absolute",
              top: TOP_WHITE_H + 30,
              left: 0,
              right: 0,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#d00" }}>{error}</Text>
          </View>
        )}
      </View>

      {/* 내 위치 이동 버튼 */}
      <TouchableOpacity style={s.gpsBtn} onPress={goToMyLocation}>
        <Image
          source={require("../../assets/images/focus.png")}
          style={{ width: 60, height: 60 }}
          resizeMode="contain"
        />
      </TouchableOpacity>

      {/* 바텀시트: 리스트/새로고침 */}
      <BottomSheet
        snapPoints={[350, Math.round(SCREEN_H * 0.36), MAX_SHEET]}
        initialSnap={0}
      >
        <View style={{ paddingBottom: 220 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{ flexDirection: "column", flex: 1 }}>
              <Text style={s.title}>안녕하세요! user123님</Text>
              <Text style={s.subTitle}>
                현재 위치에서 가장 소문난 카페입니다!
              </Text>
            </View>
            {/* 새로고침 버튼: 현재 지도 중심 기준으로 재조회 */}
            <TouchableOpacity onPress={fetchAround}>
              <Image
                source={require("../../assets/images/map_reload.png")}
                style={{ width: 27, height: 27 }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          <FlatList
            ref={listRef}
            data={expanded ? filtered : filtered.slice(0, 3)}
            keyExtractor={(i) => i.id}
            renderItem={({ item }) => (
              <PlaceCard place={item} onPress={() => focusPlace(item)} />
            )}
            ItemSeparatorComponent={() => <View style={s.itemDivider} />}
            contentContainerStyle={{ paddingBottom: 16 }}
            getItemLayout={(_, i) => ({
              length: 112,
              offset: 112 * i,
              index: i,
            })}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={
              filtered.length > 3 ? (
                <TouchableOpacity
                  style={s.moreBtn}
                  onPress={() => setExpanded((v) => !v)}
                >
                  <Text style={s.moreText}>
                    {expanded ? "접기 ∧" : "펼쳐서 더보기 ∨"}
                  </Text>
                </TouchableOpacity>
              ) : null
            }
          />
        </View>
      </BottomSheet>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  topWhite: {
    paddingTop: 10,
    paddingLeft: 18,
    paddingRight: 18,
    paddingBottom: 10,
    backgroundColor: "#fff",
    shadowColor: "rgba(156,156,156,0.25)",
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 8,
  },
  searchBar: {
    height: 50,
    borderRadius: 25,
    backgroundColor: "#F0F0F0",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
  },
  searchIcon: { width: 25, height: 25, marginHorizontal: 4 },
  searchPh: { marginLeft: 8, color: "#C2C2C2", fontSize: 16 },

  mapContainer: { flex: 1, position: "relative" },
  chipsOverlay: { position: "absolute", left: 0, right: 0, top: 12 },

  title: { fontWeight: "700", paddingTop: 35, paddingBottom: 5, fontSize: 20 },
  subTitle: {
    fontSize: 14,
    paddingTop: 3,
    paddingBottom: 30,
    color: "#9C9C9C",
  },
  moreBtn: {
    marginTop: 12,
    marginBottom: 6,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E6E6E6",
    borderRadius: 10,
    paddingVertical: 12,
  },
  moreText: {
    fontSize: 14,
    color: "#333",
  },

  itemDivider: { height: 2, backgroundColor: "#F0F0F0", marginVertical: 10 },

  gpsBtn: {
    position: "absolute",
    bottom: 350,
    right: 16,
    backgroundColor: "transparant",
    borderRadius: 50,
  },
});