// app/(whatever)/my-comments.tsx
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

const EXTRA_TOP = 8;                 // 상태바와 제목 사이 여분 (likes.tsx와 동일)
const TAB_BAR_HEIGHT = 64;
const LIST_BOTTOM_EXTRA = 16;

// 썸네일/행 스타일 튜너블
const THUMB = 56;
const ROW_GAP = 10;
const ACTION_ICON = 14;
const ACTION_GAP = 12;

type CommentRow = {
  id: string;
  user: string;
  text: string;
  replyUser?: string;
  replyText?: string;
  thumb: string;
  likes: number;
  comments: number;
  saves: number;
};

export default function MyCommentsScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  // 상단 기본 헤더 숨김 (likes.tsx와 동일)
  useEffect(() => {
    navigation.setOptions?.({ headerShown: false });
  }, [navigation]);

  // 샘플 데이터 (원하면 API로 대체)
  const data = useMemo<CommentRow[]>(
    () => [
      {
        id: "1",
        user: "sel_hyun0",
        text: "와 정말 맛있어요!!!!",
        replyUser: "sel_hy111",
        replyText: "그러게 ㅋ",
        thumb:
          "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300",
        likes: 10,
        comments: 10,
        saves: 7,
      },
      {
        id: "2",
        user: "sel_hyun0",
        text: "와 정말 맛있어요!!!!",
        thumb:
          "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=300",
        likes: 10,
        comments: 10,
        saves: 7,
      },
      {
        id: "3",
        user: "sel_hyun0",
        text: "와 정말 맛있어요!!!!",
        replyUser: "sel_hyun1",
        replyText: "이사람 닭근로서 자주 씀",
        thumb:
          "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=300",
        likes: 10,
        comments: 10,
        saves: 7,
      },
      {
        id: "4",
        user: "sel_hyun0",
        text: "와 정말 맛있어요!!!!",
        replyUser: "sel_hy111",
        replyText: "그러게 ㅋ",
        thumb:
          "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300",
        likes: 10,
        comments: 10,
        saves: 7,
      },
      {
        id: "5",
        user: "sel_hyun0",
        text: "와 정말 맛있어요!!!!",
        thumb:
          "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=300",
        likes: 10,
        comments: 10,
        saves: 7,
      },
      {
        id: "6",
        user: "sel_hyun0",
        text: "와 정말 맛있어요!!!!",
        replyUser: "sel_hyun1",
        replyText: "이사람 닭근로서 자주 씀",
        thumb:
          "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=300",
        likes: 10,
        comments: 10,
        saves: 7,
      },
      // 필요하면 더 추가...
    ],
    []
  );

  const renderItem = ({ item }: { item: CommentRow }) => {
    return (
      <Pressable style={({ pressed }) => [styles.row, pressed && { opacity: 0.6 }]}>
        {/* 왼쪽 썸네일 */}
        <Image source={{ uri: item.thumb }} style={styles.thumb} />

        {/* 가운데 내용 */}
        <View style={styles.centerCol}>
          <Text style={styles.mainText}>
            <Text style={styles.bold}>{item.user}</Text>
            <Text> {item.text}</Text>
          </Text>

          {item.replyText ? (
            <Text style={styles.replyText}>
              ㄴ <Text style={styles.bold}>{item.replyUser}</Text> {item.replyText}
            </Text>
          ) : null}
        </View>

        {/* 오른쪽 액션/카운트 */}
        <View style={styles.actions}>
          <View style={styles.actionItem}>
            <Ionicons name="heart-outline" size={ACTION_ICON} color="#888" />
            <Text style={styles.actionText}>{item.likes}</Text>
          </View>
          <View style={styles.actionItem}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={ACTION_ICON}
              color="#888"
            />
            <Text style={styles.actionText}>{item.comments}</Text>
          </View>
          <View style={styles.actionItem}>
            <Ionicons name="bookmark-outline" size={ACTION_ICON} color="#888" />
            <Text style={styles.actionText}>{item.saves}</Text>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={[styles.safe, { paddingTop: insets.top + 12 }]}>
      <StatusBar barStyle="dark-content" />

      {/* ===== 상단 커스텀 헤더 (likes.tsx 그대로) ===== */}
      <View style={[styles.header, { paddingTop: EXTRA_TOP }]}>
        <Link href="../" asChild>
          <Pressable hitSlop={10} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={30} color={"#C2C2C2"} />
          </Pressable>
        </Link>
        <Text style={styles.title}>내가 쓴 댓글 목록</Text>
        <View style={{ width: 26 }} />
      </View>

      {/* ===== 리스트 ===== */}
      <FlatList
        data={data}
        keyExtractor={(it) => it.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={{
          paddingHorizontal: 12,
          paddingBottom:
            TAB_BAR_HEIGHT + Math.max(insets.bottom, 8) + LIST_BOTTOM_EXTRA,
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
    fontFamily: "Pretendard-SemiBold",
    letterSpacing: -0.3,
  },

  // --- Row ---
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 10,
    gap: ROW_GAP,
  },
  thumb: {
    width: THUMB,
    height: THUMB,
    borderRadius: 6,
    backgroundColor: "#eee",
  },
  centerCol: { flex: 1 },
  mainText: { fontSize: 14, color: "#222", lineHeight: 20 },
  bold: { fontFamily: "Pretendard-SemiBold" },
  replyText: {
    marginTop: 6,
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },

  // --- Actions (오른쪽) ---
  actions: {
    flexDirection: "row",
    gap: ACTION_GAP,
    paddingLeft: 6,
    alignItems: "center",
  },
  actionItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  actionText: { fontSize: 12, color: "#666" },

  // --- Divider ---
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(0,0,0,0.08)",
  },
});
