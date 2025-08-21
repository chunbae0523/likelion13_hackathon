import FontAwesome from "@expo/vector-icons/FontAwesome";
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
import MapFilterBar, { FilterKey } from "../../components/MapFilterBar"; //FilterKey 자체 선언 -> MapFilterBar에서 선언한 Key 사용
import PlaceCard from "../../components/PlaceCard";
import { Place } from "../../src/types/Place";

const { height: SCREEN_H } = Dimensions.get("window");
const { height: H } = Dimensions.get("window");
const TOP_WHITE_H = 70; // 상단 검색 영역 대략 높이(패딩 포함)
const TOP_MARGIN = 16; // 상단 여유 공간
const MAX_SHEET = Math.round(SCREEN_H * 0.8);
const DEFAULT: Region = {
  latitude: 37.5665,
  longitude: 126.978,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

export default function MapPage() {
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView | null>(null);
  const listRef = useRef<FlatList<Place> | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [filters, setFilters] = useState<FilterKey[]>([]);
  const [places] = useState<Place[]>([
    {
      id: "1",
      title: "소문난 카페",
      lat: 37.57,
      lng: 126.98,
      address: "인천광역시 연수구 용담로 135, 지상 1층",
      distanceKm: 5.4,
      openNowText: "영업 중",
      reviewSummary: "리뷰 1,942",
      signatureMenuText: "로얄 시그니처 메뉴 말차라떼",
      tags: ["추천", "카페"],
    },
    {
      id: "2",
      title: "연개소문 카페",
      lat: 37.565,
      lng: 126.99,
      address: "인천광역시 연수구 동춘 1동 985, 지상 2층",
      distanceKm: 8.9,
      openNowText: "영업 중",
      reviewSummary: "리뷰 1,514",
      signatureMenuText: "땅콩 크림라떼로 완성하는 휴식",
      tags: ["인기", "카페"],
    },
    {
      id: "3",
      title: "소문이 머문 자리",
      lat: 37.55,
      lng: 126.97,
      address: "인천광역시 연수구 청능대로 89, 지상 1층",
      distanceKm: 10.5,
      openNowText: "영업 중",
      reviewSummary: "리뷰 1,106",
      signatureMenuText: "티라미수와 함께하는 커피 타임",
      tags: ["맛집"],
    },
    {
      id: "4",
      title: "소문이 머문 자리",
      lat: 37.55,
      lng: 126.97,
      address: "인천광역시 연수구 청능대로 89, 지상 1층",
      distanceKm: 10.5,
      openNowText: "영업 중",
      reviewSummary: "리뷰 1,106",
      signatureMenuText: "티라미수와 함께하는 커피 타임",
      tags: ["카페"],
    },
  ]);

  const filtered = useMemo(() => {
    if (filters.length === 0) return places;
    return places.filter((p) =>
      (p.tags ?? []).some((t) => filters.includes(t as FilterKey))
    );
  }, [places, filters]);

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
  useEffect(() => {
    if (expanded) {
      listRef.current?.scrollToOffset({ offset: 0, animated: true });
    }
  }, [expanded]);

  return (
    <View style={[{ paddingTop: insets.top }, s.container]}>
      {/* 상단 검색 영역 */}
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

      <View style={s.mapContainer}>
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFillObject}
          provider={PROVIDER_GOOGLE}
          initialRegion={DEFAULT}
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

        <View style={s.chipsOverlay} pointerEvents="box-none">
          <MapFilterBar
            selected={filters}
            onToggle={(k) =>
              setFilters((prev) =>
                prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]
              )
            }
            gap={6}
            contentPaddingH={0}
          />
        </View>
      </View>

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
            <TouchableOpacity
              onPress={() => {
                // Todo: API 재호출 로직 작성 예정... (새로고침 구현)
                console.log("새로고침!");
              }}
            >
              <Image
                source={require("@/assets/images/map_reload.png")}
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
});
