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
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

// ======= Tunables =======
const GAP = 6;
const NUM_COLS = 3;
const CELL = Math.floor((width - GAP * (NUM_COLS + 1)) / NUM_COLS);
const EXTRA_TOP = 8;
const ICON_SIZE = 34;           // 아이콘 보이는 크기
const TAB_BAR_HEIGHT = 64;
const GRID_BOTTOM_EXTRA = 16;
const MULTIPLIER = 2;
// ========================

// ✅ 업로드한 북마크 아이콘(투명 PNG)을 프로젝트에 넣고 경로를 맞춰주세요.
const BOOKMARK_ICON = require("../../assets/images/scrap1.png");

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
    <SafeAreaView style={[styles.safe, { paddingTop: insets.top + 12 }]}>
      <StatusBar barStyle="dark-content" />

      {/* 상단 커스텀 헤더 */}
      <View style={[styles.header, { paddingTop: EXTRA_TOP }]}>
        <Link href="../" asChild>
          <Pressable hitSlop={10} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={30} color={"#C2C2C2"} />
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

            {/* ✅ 각 사진 우상단에 업로드한 북마크 아이콘 오버레이 */}
            <Image source={BOOKMARK_ICON} style={styles.iconImage} resizeMode="contain" />
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />

      {/* 하단 탭 바 (사용 시 주석 해제) */}
      {/* <BottomTabBar /> */}
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
    fontFamily: "Pretendard-SemiBold",
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

  // ✔ 업로드한 북마크 아이콘 스타일
  iconImage: {
    position: "absolute",
    top: 5,
    right: 5,
    width: ICON_SIZE,
    height: ICON_SIZE,
    // 필요 시 가독성 개선:
    // shadowColor: "#000",
    // shadowOpacity: 0.15,
    // shadowRadius: 3,
    // shadowOffset: { width: 0, height: 1 },
    // elevation: 3,
  },

  // Tab Bar (커스텀 탭을 쓸 경우)
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
