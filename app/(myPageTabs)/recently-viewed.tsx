// app/(tabs)/likes.tsx
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
const EXTRA_TOP = 8;                 // 상태바와 제목 사이 여분
const HEART_SIZE = 24;               // 빨간 하트 크기
const TAB_BAR_HEIGHT = 64;
const GRID_BOTTOM_EXTRA = 16;
const MULTIPLIER = 2;                // 스크롤 양 (더 원하면 3~4)
// ========================

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

export default function LikesScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  // 상단 기본 헤더 숨김
  useEffect(() => {
    navigation.setOptions?.({ headerShown: false });
  }, [navigation]);

  // 스크롤 충분히: 데이터 MULTIPLIER배
  const data = useMemo(() => {
    const arr: string[] = [];
    for (let k = 0; k < MULTIPLIER; k++) arr.push(...baseImages);
    return arr;
  }, []);

  return (
    <SafeAreaView style={[styles.safe, { paddingTop: insets.top + 12 }]}>
      <StatusBar barStyle="dark-content" />

      {/* 상단 커스텀 헤더 */}
      <View style={[styles.header, { paddingTop: EXTRA_TOP }]}>
        <Link href="../" asChild>
          <Pressable hitSlop={10} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={26} />
          </Pressable>
        </Link>
        <Text style={styles.title}>최근 본 소문</Text>
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
          paddingBottom: TAB_BAR_HEIGHT + Math.max(insets.bottom, 8) + GRID_BOTTOM_EXTRA, // 탭바와 겹치지 않게
        }}
        renderItem={({ item }) => (
          <View style={[styles.cell, { width: CELL, height: CELL }]}>
            <Image source={{ uri: item }} style={styles.image} />
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },

  header: {
    paddingHorizontal: 12,
    paddingBottom: 24, // 제목-그리드 여백
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
    fontFamily: "Pretendard-Semibold",
    letterSpacing: -0.3,
  },

  cell: {
    aspectRatio: 1,
    borderRadius: 0,                // 각진 모서리
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#f2f2f2",
  },
  image: { width: "100%", height: "100%", borderRadius: 0 },
  heartIcon: { position: "absolute", top: 5, right: 5 }, // 가독성 위해서 하트 위치 우상단으로 더 올림

  // ---- Tab Bar ----
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
