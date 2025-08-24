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
import { Link, Href, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { myPage } from "../styles/myPage_style";

//icon Import
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Octicons from "@expo/vector-icons/Octicons";
import { Ionicons } from "@expo/vector-icons";

const EXTRA_TOP = 6;

const pill = StyleSheet.create({
  box: {
    backgroundColor: "#F0F0F0",
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
    color: "#9C9C9C",
    fontFamily: "Pretendard",
    fontWeight: 500,
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
  confirmBtn: { backgroundColor: "#EA6844" },
  cancelText: { fontSize: 15, color: "#444", fontFamily: "Pretendard-Medium" },
  confirmText: { fontSize: 15, color: "#fff", fontFamily: "Pretendard-Bold" },
  ml10: { marginLeft: 10 },
  pressed: { opacity: 0.6 },
});

/** 통계 박스 */
const StatBox = ({ label, value }: { label: string; value: string }) => (
  <View style={myPage.statItem}>
    <Text style={myPage.statValue}>{value}</Text>
    <Text style={myPage.statLabel}>{label}</Text>
  </View>
);

const RowItem = ({
  label,
  href,
  icon,
}: {
  label: string;
  href: Href;
  icon: any;
}) => {
  const router = useRouter();
  return (
    <Pressable
      onPress={() => router.push(href)}
      style={({ pressed }) => [myPage.row, pressed && { opacity: 0.6 }]}
    >
      <View style={myPage.rowLeft}>
        {icon && (
          <Image
            source={icon}
            style={{ width: 20, height: 20, resizeMode: "contain" }}
          />
        )}
        <Text style={myPage.rowText}>{label}</Text>
      </View>
      <Image
        source={require("../../assets/images/arrow_right.png")}
        style={{ width: 30, height: 30, tintColor: "#555555" }}
      />
    </Pressable>
  );
};

/** 설정 전용 (텍스트만) */
const SettingsItem = ({ label, href }: { label: string; href: Href }) => {
  const router = useRouter();
  return (
    <Pressable
      onPress={() => router.push(href)}
      style={({ pressed }) => [myPage.settingsRow, pressed && { opacity: 0.6 }]}
    >
      <Text style={myPage.settingsText} numberOfLines={1}>
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
    <SafeAreaView style={[myPage.safe, { paddingTop: insets.top + EXTRA_TOP }]}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={myPage.container}>
        {/* Header */}
        <View style={myPage.headerRow}>
          <Text style={myPage.title}>마이페이지</Text>
          <View style={myPage.headerIcons}>
            <Pressable onPress={() => router.push("/(myPageTabs)/notice")}>
              <Octicons name="bell-fill" size={25} color="#C2C2C2" />
            </Pressable>
            <MaterialIcons name="settings" size={25} color="#C2C2C2" />
          </View>
        </View>

        {/* Profile */}
        <View style={[myPage.profileCard, { overflow: "visible" }]}>
          <Image
            source={require("../../assets/images/profile_default.png")}
            style={myPage.avatar}
          />
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row" }}>
              <Text style={myPage.nickname}>소문이</Text>
              <View style={myPage.badge}>
                <Text style={myPage.badgeText}>사장님</Text>
              </View>
            </View>

            <Text style={myPage.username}>@username123</Text>
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
        <View style={myPage.statCard}>
          <StatBox label="게시물" value="137" />
          <StatBox label="팔로워" value="7.5만" />
          <StatBox label="팔로잉" value="5" />
        </View>
        <View style={myPage.insightCtaBox}>
          <Pressable
            style={myPage.insightCta}
            onPress={() => router.push("../(myPageTabs)/insite")}
          >
            <Text style={myPage.insightCtaText}>인사이트 보러가기</Text>
          </Pressable>
        </View>
        {/* 관심 */}
        <Text style={myPage.sectionTitle}>나의 관심</Text>
        <View style={myPage.card}>
          <RowItem
            icon={require("../../assets/images/my_like.png")}
            label="좋아요"
            href="/(myPageTabs)/likes"
          />

          <RowItem
            icon={require("../../assets/images/my_comment.png")}
            label="댓글"
            href="/(myPageTabs)/comments"
          />
          <RowItem
            icon={require("../../assets/images/my_scrap.png")}
            label="스크랩"
            href="/(myPageTabs)/scraps"
          />
        </View>

        <View style={myPage.divider} />
        {/* 활동 */}
        <Text style={myPage.sectionTitle}>나의 활동</Text>
        <View style={myPage.card}>
          <RowItem
            icon={require("../../assets/images/my_somun.png")}
            label="내가 작성한 소문"
            href="/myposts"
          />
          <RowItem
            icon={require("../../assets/images/my_somun_recent.png")}
            label="최근 본 소문"
            href="/recently-viewed"
          />
        </View>
        <View style={myPage.divider} />
        {/* 설정 */}
        <Text style={myPage.sectionTitle}>설정</Text>
        <View style={myPage.settingsCard}>
          <SettingsItem label="내 동네 설정" href="/(settings)/neighborhood" />
          <SettingsItem label="언어설정" href="/(settings)/language" />

          <Pressable
            onPress={() => setConfirmType("logout")}
            style={({ pressed }) => [
              myPage.settingsRow,
              pressed && { opacity: 0.6 },
            ]}
          >
            <Text style={myPage.settingsText} numberOfLines={1}>
              로그아웃
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setConfirmType("delete")}
            style={({ pressed }) => [
              myPage.settingsRow,
              pressed && { opacity: 0.6 },
            ]}
          >
            <Text style={myPage.settingsText} numberOfLines={1}>
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
