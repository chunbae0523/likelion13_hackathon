// app/(myPageTabs)/profile-view.tsx
import React, { useEffect, useMemo } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  FlatList,
  Dimensions,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link, useNavigation } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

// ======= Tunables =======
const EXTRA_TOP = 8;
const TAB_BAR_HEIGHT = 64;
const LIST_BOTTOM_EXTRA = 16;

const GAP = 6;
const NUM_COLS = 3;
const CELL = Math.floor((width - GAP * (NUM_COLS + 1)) / NUM_COLS);

const AVATAR_SIZE = 88;
const BADGE_BG = "#FF6B3D";
const BTN_BG = "#D9D9D9";
const SIDE = 16; // topWrap 좌우 패딩
// ========================

type GridItem =
  | { id: string; type: "img"; uri: string }
  | { id: string; type: "placeholder"; chat?: boolean };

export default function ProfileViewScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    navigation.setOptions?.({ headerShown: false });
  }, [navigation]);

  // 9칸 = 사진 7 + 말풍선 placeholder 2
  const data = useMemo<GridItem[]>(
    () => [
      { id: "1", type: "img", uri: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600" },
      { id: "2", type: "img", uri: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600" },
      { id: "3", type: "img", uri: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=600" },
      { id: "4", type: "img", uri: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600" },
      { id: "5", type: "img", uri: "https://images.unsplash.com/photo-1548946526-f69e2424cf45?w=600" },
      { id: "6", type: "placeholder", chat: true },
      { id: "7", type: "img", uri: "https://images.unsplash.com/photo-1488900128323-21503983a07e?w=600" },
      { id: "8", type: "img", uri: "https://images.unsplash.com/photo-1488900128323-21503983a07e?w=600" },
      { id: "9", type: "placeholder", chat: true },
    ],
    []
  );

  const ListHeader = () => (
    <>
      {/* 헤더 (likes.tsx 동일) */}
      <View style={[styles.header, { paddingTop: EXTRA_TOP }]}>
        <Link href="../" asChild>
          <Pressable hitSlop={10} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={30} color={"#C2C2C2"} />
          </Pressable>
        </Link>
        <Text style={styles.title} />
        <Pressable hitSlop={10} style={{ width: 26, alignItems: "flex-end" }}>
          <Ionicons name="ellipsis-horizontal" size={20} color="#999" />
        </Pressable>
      </View>

      {/* 프로필 상단 */}
      <View style={styles.topWrap}>
        <Image
          source={{ uri: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800" }}
          style={styles.avatar}
        />

        <View style={styles.nameRow}>
          <Text style={styles.nickname}>소문이</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>주민</Text>
          </View>
        </View>

        <Text style={styles.username}>@sel_hyun0</Text>

        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={14} color="#999" />
          <Text style={styles.locationText}>연수구 동양로 135</Text>
        </View>

        {/* ✅ 통계: 화면 좌우로 더 넓게 펼침 */}
        <View style={styles.statsRow}>
          <View style={[styles.statItem, styles.withRightBorder]}>
            <Text style={styles.statValue}>137</Text>
            <Text style={styles.statLabel}>게시물</Text>
          </View>

          <View style={[styles.statItem, styles.withRightBorder]}>
            <Text style={styles.statValue}>7.5만</Text>
            <Text style={styles.statLabel}>팔로워</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statValue}>5</Text>
            <Text style={styles.statLabel}>팔로잉</Text>
          </View>
        </View>

        {/* 버튼 2개 — 화면 좌우 꽉 채움 */}
        <View style={styles.btnRow}>
          <Pressable style={({ pressed }) => [styles.actionBtn, pressed && { opacity: 0.7 }]}>
            <Text style={styles.actionBtnText}>프로필 편집</Text>
          </Pressable>
          <Pressable style={({ pressed }) => [styles.actionBtn, pressed && { opacity: 0.7 }]}>
            <Text style={styles.actionBtnText}>프로필 공유</Text>
          </Pressable>
        </View>
      </View>
    </>
  );

  const renderCell = ({ item }: { item: GridItem }) => {
    if (item.type === "img") {
      return (
        <View style={[styles.cell, { width: CELL, height: CELL }]}>
          <Image source={{ uri: item.uri }} style={styles.image} />
        </View>
      );
    }
    return (
      <View style={[styles.cell, { width: CELL, height: CELL, backgroundColor: "#E9E9EB" }]}>
        <Ionicons name="chatbubble-outline" size={16} color="#000" style={styles.chatIcon} />
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.safe, { paddingTop: insets.top + 12 }]}>
      <StatusBar barStyle="dark-content" />
      <FlatList
        data={data}
        keyExtractor={(it) => it.id}
        renderItem={renderCell}
        numColumns={NUM_COLS}
        columnWrapperStyle={{ gap: GAP, paddingHorizontal: GAP }}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={{
          gap: GAP,
          paddingBottom: TAB_BAR_HEIGHT + Math.max(insets.bottom, 8) + LIST_BOTTOM_EXTRA,
        }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },

  // Header
  header: {
    paddingHorizontal: 12,
    paddingBottom: 16,
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

  // Top profile
  topWrap: {
    alignItems: "center",
    paddingHorizontal: SIDE,
    paddingBottom: 12,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: "#eee",
  },
  nameRow: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  nickname: { fontSize: 22, fontFamily: "Pretendard-SemiBold" },
  badge: { backgroundColor: BADGE_BG, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  badgeText: { color: "#fff", fontSize: 14, fontFamily: "Pretendard-Medium" },
  username: { marginTop: 4, fontSize: 14, color: "#A0A0A0", fontFamily: "Pretendard-Medium" },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 },
  locationText: { fontSize: 13, color: "#999", fontFamily: "Pretendard-SemiBold" },

  // ✅ Stats — 좌우로 더 넓게  
  statsRow: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "stretch",
    width: "100%",
    // 부모의 좌우 패딩(SIDE)을 상쇄 → 화면 끝까지 확장
    marginHorizontal: -SIDE,
    // 너무 붙는 느낌을 막기 위한 내측 여백
    paddingHorizontal: 12,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    gap: 2,
    paddingVertical: 6,
  },
  // 세로 구분선: 첫·둘째 항목 오른쪽에만
  withRightBorder: {
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: "rgba(0,0,0,0.12)",
  },
  statValue: { fontSize: 18, fontFamily: "Pretendard-Bold", color: "#111" },
  statLabel: { fontSize: 12, color: "#8C8C8C", fontFamily: "Pretendard-Regular" },

  // Buttons — 좌우 꽉
  btnRow: {
    marginTop: 12,
    flexDirection: "row",
    width: "100%",
    gap: 12,
    marginHorizontal: -SIDE,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: BTN_BG,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  actionBtnText: { fontSize: 14, color: "#333", fontFamily: "Pretendard-Medium" },

  // Grid
  cell: { aspectRatio: 1, borderRadius: 10, overflow: "hidden", position: "relative", backgroundColor: "#f2f2f2" },
  image: { width: "100%", height: "100%" },
  chatIcon: { position: "absolute", right: 6, bottom: 6 },
});
