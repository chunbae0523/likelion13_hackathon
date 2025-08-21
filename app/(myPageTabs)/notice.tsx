import React, { useEffect, useMemo } from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Pressable,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link, useNavigation } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const EXTRA_TOP = 8;                 // 상태바와 제목 사이 여분 (likes.tsx 동일)
const TAB_BAR_HEIGHT = 64;
const LIST_BOTTOM_EXTRA = 16;
const AVATAR = "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085";
const AVATAR_SIZE = 52;              // 스샷 느낌에 맞춘 크기
const ROW_GAP = 12;

type Noti = {
  id: string;
  name: string;
  avatar: string;
  kind: "like" | "message" | "comment";
  text?: string;     // 본문에 붙일 추가 텍스트
  reply?: string;    // 대댓글 미리보기(옵션)
};

export default function NotificationsScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  // 기본 헤더 숨김 (likes.tsx와 동일)
  useEffect(() => {
    navigation.setOptions?.({ headerShown: false });
  }, [navigation]);

  // 샘플 데이터 (원하면 API 연동)
  const data = useMemo<Noti[]>(
    () => [
      { id: "1", name: "sel_hyun0", avatar: AVATAR, kind: "like", text: "좋아요를 눌렀습니다." },
      { id: "2", name: "sel_hyun0", avatar: AVATAR, kind: "message", text: "메시지를 보냈습니다." },
      {
        id: "3",
        name: "sel_hyun0",
        avatar: AVATAR,
        kind: "comment",
        text: "댓글을 달았습니다.",
        reply: "정말 맛있었어!!",
      },
      { id: "4", name: "sel_hyun0", avatar: AVATAR, kind: "like", text: "좋아요를 눌렀습니다." },
      { id: "5", name: "sel_hyun0", avatar: AVATAR, kind: "like", text: "좋아요를 눌렀습니다." },
      { id: "6", name: "sel_hyun0", avatar: AVATAR, kind: "like", text: "좋아요를 눌렀습니다." },
      { id: "7", name: "sel_hyun0", avatar: AVATAR, kind: "like", text: "좋아요를 눌렀습니다." },
      { id: "8", name: "sel_hyun0", avatar: AVATAR, kind: "like", text: "좋아요를 눌렀습니다." },
      { id: "9", name: "sel_hyun0", avatar: AVATAR, kind: "like", text: "좋아요를 눌렀습니다." },
      { id: "10", name: "sel_hyun0", avatar: AVATAR, kind: "like", text: "좋아요를 눌렀습니다." },
    ],
    []
  );

  const renderRow = ({ item }: { item: Noti }) => {
    return (
      <Pressable style={({ pressed }) => [styles.row, pressed && { opacity: 0.6 }]}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <View style={styles.textCol}>
          <Text style={styles.mainText}>
            <Text style={styles.bold}>{item.name}</Text>
            <Text>님이 </Text>
            <Text>{item.text}</Text>
          </Text>

          {item.reply ? <Text style={styles.replyText}>ㄴ {item.reply}</Text> : null}
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={[styles.safe, { paddingTop: insets.top + 12 }]}>
      <StatusBar barStyle="dark-content" />

      {/* ===== 상단 커스텀 헤더 (likes.tsx와 동일 패턴) ===== */}
      <View style={[styles.header, { paddingTop: EXTRA_TOP }]}>
        <Link href="../" asChild>
          <Pressable hitSlop={10} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={26} />
          </Pressable>
        </Link>
        <Text style={styles.title}>알림</Text>
        <View style={{ width: 26 }} />
      </View>

      {/* ===== 리스트 ===== */}
      <FlatList
        data={data}
        keyExtractor={(it) => it.id}
        renderItem={renderRow}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={{
          paddingHorizontal: 12,
          paddingBottom: TAB_BAR_HEIGHT + Math.max(insets.bottom, 8) + LIST_BOTTOM_EXTRA,
        }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },

  // --- Header (likes.tsx에서 가져옴) ---
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
    fontFamily: "Pretendard-Semibold",
    letterSpacing: -0.3,
  },

  // --- Row ---
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    gap: ROW_GAP,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: "#eee",
  },
  textCol: { flex: 1 },
  mainText: { fontSize: 14, color: "#222" },
  bold: { fontFamily: "Pretendard-Semibold" },
  replyText: {
    marginTop: 6,
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },

  // --- Divider ---
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(0,0,0,0.08)",
    marginLeft: 0, // 풀폭 라인 (스샷 느낌)
  },
});
