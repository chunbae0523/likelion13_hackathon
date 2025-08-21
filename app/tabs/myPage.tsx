// app/(tabs)/myPage.tsx
import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  Modal,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link, Href, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styles from "../styles/myPage_style.js";

const EXTRA_TOP = 6;

/** ✅ 회색 둥근(Pill) 버튼 — 로컬 스타일 (외부와 충돌 방지) */
const pill = StyleSheet.create({
  box: {
    backgroundColor: "#EFEFF1",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E2E3E7",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 14,
    color: "#6B6B6B",
    fontFamily: "Pretendard-Semibold",
  },
});

/** 모달 전용 로컬 스타일 */
const local = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 320,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  text: { fontSize: 15, marginBottom: 14, textAlign: "center" },
  actions: { flexDirection: "row" },
  btn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtn: { backgroundColor: "#EFEFF0" },
  confirmBtn: { backgroundColor: "#FF6B3D" },
  cancelText: { fontSize: 15, color: "#444", fontWeight: "600" },
  confirmText: { fontSize: 15, color: "#fff", fontWeight: "700" },
  ml10: { marginLeft: 10 },
  pressed: { opacity: 0.6 },
});

/** 통계 박스 */
const StatBox = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.statItem}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

/** 일반 행 (아이콘 + 텍스트 + →) */
const RowItem = ({
  icon,
  label,
  href,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  href: Href;
}) => {
  const router = useRouter();
  return (
    <Pressable
      onPress={() => router.push(href)}
      style={({ pressed }) => [styles.row, pressed && { opacity: 0.6 }]}
    >
      <View style={styles.rowLeft}>
        <Ionicons name={icon} size={22} />
        <Text style={styles.rowText} numberOfLines={1}>
          {label}
        </Text>
      </View>
      <View style={styles.rowRight}>
        <Ionicons name="chevron-forward" size={20} />
      </View>
    </Pressable>
  );
};

/** 설정 전용 (텍스트만) */
const SettingsItem = ({ label, href }: { label: string; href: Href }) => {
  const router = useRouter();
  return (
    <Pressable
      onPress={() => router.push(href)}
      style={({ pressed }) => [styles.settingsRow, pressed && { opacity: 0.6 }]}
    >
      <Text style={styles.settingsText} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
};

export default function MyPage() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // 단일 모달로 로그아웃/탈퇴 구분
  const [confirmType, setConfirmType] = useState<null | "logout" | "delete">(
    null
  );
  const closeModal = () => setConfirmType(null);

  const message =
    confirmType === "logout"
      ? "로그아웃 하시겠습니까?"
      : confirmType === "delete"
      ? "탈퇴하시겠습니까?"
      : "";

  const confirmLabel = confirmType === "delete" ? "탈퇴하기" : "로그아웃";

  const handleConfirm = async () => {
    const type = confirmType;
    closeModal();

    if (type === "logout") {
      // TODO: 실제 로그아웃 로직
      // await auth.signOut();
      // router.replace('/login');
    } else if (type === "delete") {
      // TODO: 실제 탈퇴 로직
      // await api.deleteAccount();
      // router.replace('/goodbye');
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { paddingTop: insets.top + EXTRA_TOP }]}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.title}>마이페이지</Text>
          <View style={styles.headerIcons}>
            <Pressable onPress={() => router.push("/(myPageTabs)/notice")}>
              <Image
                source={require("../../assets/images/notice.png")}
                style={[styles.headerIcon, { width: 22, height: 22 }]}
                resizeMode="contain"
              />
            </Pressable>
            <Ionicons name="settings-outline" size={22} />
          </View>
        </View>

        {/* Profile */}
        <View style={[styles.profileCard, { overflow: "visible" }]}>
          <Image
            source={{ uri: "https://i.pravatar.cc/100?img=3" }}
            style={styles.avatar}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.nickname}>소문이</Text>
            <Text style={styles.username}>@username123</Text>
          </View>

          <Link href="/(myPageTabs)/profile-view" asChild>
            <Pressable style={({ pressed }) => [pressed && { opacity: 0.7 }]}>
              <View style={pill.box}>
                <Text style={pill.text}>프로필 보기</Text>
              </View>
            </Pressable>
          </Link>
        </View>

        {/* Stats */}
        <View style={styles.statCard}>
          <StatBox label="게시물" value="137" />
          <View style={styles.divider} />
          <StatBox label="팔로워" value="7.5만" />
          <View style={styles.divider} />
          <StatBox label="팔로잉" value="5" />
        </View>

        {/* 관심 */}
        <Text style={styles.sectionTitle}>나의 관심</Text>
        <View style={styles.card}>
          <RowItem
            icon="heart-outline"
            label="좋아요"
            href="/(myPageTabs)/likes"
          />
          <View style={styles.separator} />
          <RowItem
            icon="chatbubble-ellipses-outline"
            label="댓글"
            href="/(myPageTabs)/comments"
          />
          <View style={styles.separator} />
          <RowItem
            icon="bookmark-outline"
            label="스크랩"
            href="/(myPageTabs)/scraps"
          />
        </View>

        {/* 활동 */}
        <Text style={styles.sectionTitle}>나의 활동</Text>
        <View style={styles.card}>
          <RowItem
            icon="document-text-outline"
            label="내가 작성한 소문"
            href="/myposts"
          />
          <View style={styles.separator} />
          <RowItem
            icon="time-outline"
            label="최근 본 소문"
            href="/recently-viewed"
          />
        </View>

        {/* 설정 */}
        <Text style={styles.sectionTitle}>설정</Text>
        <View style={styles.settingsCard}>
          <SettingsItem label="내 동네 설정" href="/(settings)/neighborhood" />
          <SettingsItem label="언어설정" href="/(settings)/language" />

          <Pressable
            onPress={() => setConfirmType("logout")}
            style={({ pressed }) => [
              styles.settingsRow,
              pressed && { opacity: 0.6 },
            ]}
          >
            <Text style={styles.settingsText} numberOfLines={1}>
              로그아웃
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setConfirmType("delete")}
            style={({ pressed }) => [
              styles.settingsRow,
              pressed && { opacity: 0.6 },
            ]}
          >
            <Text style={styles.settingsText} numberOfLines={1}>
              탈퇴하기
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* 단일 확인 모달 */}
      <Modal
        transparent
        visible={confirmType !== null}
        animationType="fade"
        onRequestClose={closeModal}
        statusBarTranslucent // ✅ 상단 상태바 영역까지 오버레이 적용
      >
        <View style={local.overlay}>
          <View style={local.card}>
            <Text style={local.text}>{message}</Text>
            <View style={local.actions}>
              <Pressable
                onPress={closeModal}
                style={({ pressed }) => [
                  local.btn,
                  local.cancelBtn,
                  pressed && local.pressed,
                ]}
              >
                <Text style={local.cancelText}>취소</Text>
              </Pressable>
              <Pressable
                onPress={handleConfirm}
                style={({ pressed }) => [
                  local.btn,
                  local.confirmBtn,
                  local.ml10,
                  pressed && local.pressed,
                ]}
              >
                <Text style={local.confirmText}>{confirmLabel}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
