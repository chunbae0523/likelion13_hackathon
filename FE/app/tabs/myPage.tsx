// app/(tabs)/myPage.tsx
import React, { useState, useEffect } from "react";
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
import { Link, Href, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styles from "../styles/myPage_style.js";

// 아이콘 라이브러리 불러오기
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Ionicons } from "@expo/vector-icons";

// ✅ [ADD] 로그인한 유저 정보 불러오기
import AsyncStorage from "@react-native-async-storage/async-storage";

const EXTRA_TOP = 6;
// Pressable 눌렀을 때 공통으로 쓸 투명도 효과
const PRESSED = { opacity: 0.6 };
const PRESSED_SOFT = { opacity: 0.7 };

// ── 헤더 아이콘 스타일 (이 파일 전용) ─────────────────────────────────────────
const header = StyleSheet.create({
  iconBtn: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  iconImg: { width: 22, height: 22, resizeMode: "contain" },
});

// ── 회색 Pill 버튼 (프로필 보기 전용) ─────────────────────────────────────────
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
  text: { fontSize: 14, color: "#6B6B6B", fontFamily: "Pretendard-Semibold" },
});

// ── 확인 모달 스타일 (로그아웃/탈퇴) ─────────────────────────────────────────
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
});

// ── 소형 컴포넌트 ───────────────────────────────────────────────────────────
// 프로필 하단의 통계 박스 (게시물/팔로워/팔로잉)
const StatBox = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.statItem}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

// 아이콘 + 텍스트 + 우측 화살표 행 (RowItem)
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
      style={({ pressed }) => [styles.row, pressed && PRESSED]}
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

// 설정 화면에서 사용하는 텍스트 전용 행 (href 또는 onPress 지원)
const SettingsItem = ({
  label,
  href,
  onPress,
}: {
  label: string;
  href?: Href;
  onPress?: () => void;
}) => {
  const router = useRouter();
  const handlePress = () => {
    if (href) router.push(href);
    else onPress?.();
  };
  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [styles.settingsRow, pressed && PRESSED]}
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

  // ✅ [ADD] 로그인 중인 사용자 정보 상태
  const [profile, setProfile] = useState<{ username?: string; email?: string }>(
    {}
  );

  // 하나의 모달로 로그아웃 / 탈퇴 확인 처리
  const [confirmType, setConfirmType] = useState<null | "logout" | "delete">(
    null
  );
  const closeModal = () => setConfirmType(null);

  // confirmType 값에 따라 메시지와 버튼 텍스트 다르게 표시
  const message =
    confirmType === "logout"
      ? "로그아웃 하시겠습니까?"
      : confirmType === "delete"
      ? "탈퇴하시겠습니까?"
      : "";
  const confirmLabel = confirmType === "delete" ? "탈퇴하기" : "로그아웃";

  // 실제 처리 로직 (API 연동 부분은 TODO)
  const handleConfirm = async () => {
    const type = confirmType;
    closeModal();
    if (type === "logout") {
      // TODO: 실제 로그아웃 로직 추가
      // await auth.signOut();
      // router.replace('/login');
    } else if (type === "delete") {
      // TODO: 실제 탈퇴 로직 추가
      // await api.deleteAccount();
      // router.replace('/goodbye');
    }
  };

  // ✅ [ADD] 화면 마운트 시 현재 유저 정보 로드
  useEffect(() => {
    (async () => {
      try {
        const json = await AsyncStorage.getItem("currentUser");
        if (json) {
          const parsed = JSON.parse(json);
          setProfile({ username: parsed?.username, email: parsed?.email });
        }
      } catch (e) {
        console.warn("failed to load currentUser", e);
      }
    })();
  }, []);

  return (
    <SafeAreaView style={[styles.safe, { paddingTop: insets.top + EXTRA_TOP }]}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.container}>
        {/* 헤더 영역 (타이틀 + 알림/설정 버튼) */}
        <View style={styles.headerRow}>
          <Text style={styles.title}>마이페이지</Text>
          <View style={[styles.headerIcons, { alignItems: "center" }]}>
            {/* 알림 버튼 */}
            <Pressable
              onPress={() => router.push("/(myPageTabs)/notice")}
              style={({ pressed }) => [
                header.iconBtn,
                pressed && PRESSED,
                { marginRight: -12 },
              ]}
            >
              <Image
                source={require("../../assets/images/notice.png")}
                style={header.iconImg}
              />
            </Pressable>
            {/* 설정 버튼 */}
            <Pressable
              style={({ pressed }) => [header.iconBtn, pressed && PRESSED]}
            >
              <MaterialIcons name="settings" size={22} color="#C2C2C2" />
            </Pressable>
          </View>
        </View>

        {/* 프로필 카드 (아바타, 닉네임, 아이디, 프로필 보기 버튼) */}
        <View style={[styles.profileCard, { overflow: "visible" }]}>
          <Image
            source={{ uri: "https://i.pravatar.cc/100?img=3" }}
            style={styles.avatar}
          />
          <View style={{ flex: 1 }}>
            {/* ✅ [FIX] 닉네임 자리: 로그인 유저의 username */}
            <Text style={styles.nickname}>{profile.username || "소문이"}</Text>

            {/* ✅ [FIX] 아이디 자리는 이메일 그대로 (이메일 자체에 @ 포함) */}
            <Text style={styles.username}>
              {profile.email || "user@example.com"}
            </Text>
          </View>

          {/* 프로필 보기 버튼 */}
          <Link href="/(myPageTabs)/profile-view" asChild>
            <Pressable style={({ pressed }) => [pressed && PRESSED_SOFT]}>
              <View style={pill.box}>
                <Text style={pill.text}>프로필 보기</Text>
              </View>
            </Pressable>
          </Link>
        </View>

        {/* 통계 카드 (게시물/팔로워/팔로잉) */}
        <View style={styles.statCard}>
          <StatBox label="게시물" value="137" />
          <View style={styles.divider} />
          <StatBox label="팔로워" value="7.5만" />
          <View style={styles.divider} />
          <StatBox label="팔로잉" value="5" />
        </View>

        {/* 나의 관심 (좋아요/댓글/스크랩) */}
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

        {/* 나의 활동 (내 글, 최근 본 글) */}
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

        {/* 설정 메뉴 (동네 설정, 언어, 로그아웃, 탈퇴) */}
        <Text style={styles.sectionTitle}>설정</Text>
        <View style={styles.settingsCard}>
          <SettingsItem label="내 동네 설정" href="/(settings)/neighborhood" />
          <SettingsItem label="언어설정" href="/(settings)/language" />
          <SettingsItem
            label="로그아웃"
            onPress={() => setConfirmType("logout")}
          />
          <SettingsItem
            label="탈퇴하기"
            onPress={() => setConfirmType("delete")}
          />
        </View>
      </ScrollView>

      {/* 로그아웃/탈퇴 확인 모달 */}
      <Modal
        transparent
        visible={confirmType !== null}
        animationType="fade"
        onRequestClose={closeModal}
        statusBarTranslucent
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
                  pressed && PRESSED,
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
                  pressed && PRESSED,
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
