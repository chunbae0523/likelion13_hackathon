// app/(tabs)/scraps.tsx
import React, { useMemo, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Pressable,
  Dimensions,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link, useNavigation } from "expo-router";
import type { Href } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

// ======= Tunables =======
const GAP = 6;
const NUM_COLS = 3;
const CELL = Math.floor((width - GAP * (NUM_COLS + 1)) / NUM_COLS);
const EXTRA_TOP = 8;
const ICON_SIZE = 24;           // 아이콘 보이는 크기
const TAB_BAR_HEIGHT = 64;
const GRID_BOTTOM_EXTRA = 16;
const MULTIPLIER = 2;
// ========================

// ✅ 커스텀 북마크 아이콘(투명배경 PNG/SVG)을 프로젝트에 넣고 경로를 맞춰주세요.
const BOOKMARK_ICON = require("../../assets/icons/bookmark-filled-outline.png");

const baseImages = [
  "https://images.unsplash.com/photo-1511920170033-f8396924c348",
  "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0",
  "https://images.unsplash.com/photo-1511920170033-f8396924c348?2",
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085",
  "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?2",
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?2",
  "https://images.unsplash.com/photo-1511920170033-f8396924c348?3",
  "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?3",
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?3",
  "https://images.unsplash.com/photo-1511920170033-f8396924c348?4",
  "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?4",
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?4",
];

// -------- Bottom Tab Bar (Link asChild + Href 타입) --------
type NavItem = {
  key: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: Href;
};

const tabItems: ReadonlyArray<NavItem> = [
  { key: "home", label: "홈", icon: "home-outline", route: "/(tabs)" as const },
  { key: "community", label: "커뮤니티", icon: "chatbubble-ellipses-outline", route: "/(tabs)/community" as const },
  { key: "map", label: "지도", icon: "location-outline", route: "/(tabs)/map" as const },
  { key: "mypage", label: "마이페이지", icon: "person-outline", route: "/(tabs)/mypage" as const },
];

function BottomTabBar() {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.tabBar,
        {
          paddingBottom: Math.max(insets.bottom, 8),
          height: TAB_BAR_HEIGHT + Math.max(insets.bottom, 8),
        },
      ]}
    >
      {tabItems.map((it) => (
        <Link key={it.key} href={it.route} asChild>
          <Pressable style={styles.tabItem}>
            <Ionicons name={it.icon} size={24} />
            <Text style={styles.tabLabel}>{it.label}</Text>
          </Pressable>
        </Link>
      ))}
    </View>
  );
}
// -----------------------------------------------------------

export default function ScrapsScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  // 기본 헤더 숨김
  useEffect(() => {
    navigation.setOptions?.({ headerShown: false });
  }, [navigation]);

  // 데이터 늘리기(스크롤 충분히)
  const data = useMemo(() => {
    const arr: string[] = [];
    for (let k = 0; k < MULTIPLIER; k++) arr.push(...baseImages);
    return arr;
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      {/* 상단 커스텀 헤더 */}
      <View style={[styles.header, { paddingTop: insets.top + EXTRA_TOP }]}>
        <Link href="../" asChild>
          <Pressable hitSlop={10} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={26} />
          </Pressable>
        </Link>
        <Text style={styles.title}>저장한 게시물</Text>
        <View style={{ width: 26 }} />
      </View>

      {/* 그리드 */}
      <FlatList
        data={data}
        keyExtractor={(uri, idx) => `${uri}-${idx}`}
        numColumns={NUM_COLS}
        columnWrapperStyle={{ gap: GAP, paddingHorizontal: GAP }}
        contentContainerStyle={{
          gap: GAP,
          paddingBottom:
            TAB_BAR_HEIGHT + Math.max(insets.bottom, 8) + GRID_BOTTOM_EXTRA,
        }}
        renderItem={({ item }) => (
          <View style={[styles.cell, { width: CELL, height: CELL }]}>
            <Image source={{ uri: item }} style={styles.image} />
            {/* ✅ 커스텀 북마크 아이콘으로 교체 */}
            <Image
              source={BOOKMARK_ICON}
              style={styles.iconImage}
              resizeMode="contain"
            />
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />

      {/* 하단 탭 바 */}
      <BottomTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  header: {
    paddingHorizontal: 12,
    paddingBottom: 24,
    flexDirection: "row",
    alignItems: "center",
  },
  backBtn: {
    width: 26,
    height: 26,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  cell: {
    aspectRatio: 1,
    borderRadius: 0,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#f2f2f2",
  },
  image: { width: "100%", height: "100%", borderRadius: 0 },

  // ✔ 커스텀 아이콘 스타일
  iconImage: {
    position: "absolute",
    top: 10,
    right: 10,
    width: ICON_SIZE,
    height: ICON_SIZE,
  },

  // Tab Bar
  tabBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: TAB_BAR_HEIGHT,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(0,0,0,0.08)",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: -2 },
    elevation: 8,
  },
  tabItem: { flex: 1, alignItems: "center", justifyContent: "center", gap: 4 },
  tabLabel: { fontSize: 12, color: "#8E8E93" },
});
