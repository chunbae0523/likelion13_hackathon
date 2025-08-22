// app/(settings)/language.tsx
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Pressable,
  StatusBar,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link, useNavigation } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const EXTRA_TOP = 8; // 상태바와 제목 사이 여분

export default function LanguageScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [modalVisible, setModalVisible] = useState(false);
  const [pendingLang, setPendingLang] = useState<"ko" | "en" | null>(null);
  const [currentLang, setCurrentLang] = useState<"ko" | "en">("ko");

  useEffect(() => {
    navigation.setOptions?.({ headerShown: false });
  }, [navigation]);

  const openConfirm = (lang: "ko" | "en") => {
    setPendingLang(lang);
    setModalVisible(true);
  };

  const confirm = () => {
    if (pendingLang) setCurrentLang(pendingLang);
    setModalVisible(false);
    setPendingLang(null);
    // TODO: 실제 i18n 변경 로직 연결
  };

  const cancel = () => {
    setModalVisible(false);
    setPendingLang(null);
  };

  const message =
    pendingLang === "ko"
      ? "언어를 한국어로 바꾸겠습니까?"
      : "언어를 English로 바꾸겠습니까?";

  return (
    <SafeAreaView style={[styles.safe, { paddingTop: insets.top + 12 }]}>
      <StatusBar barStyle="dark-content" />

      {/* ===== 상단 커스텀 헤더 ===== */}
      <View style={[styles.header, { paddingTop: EXTRA_TOP }]}>
        <Link href="../" asChild>
          <Pressable hitSlop={10} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={26} />
          </Pressable>
        </Link>
        <Text style={styles.title}>언어 설정</Text>
        <View style={{ width: 26 }} />
      </View>

      {/* ===== 본문: 언어 버튼 ===== */}
      <View style={styles.list}>
        <Pressable
          onPress={() => openConfirm("ko")}
          style={({ pressed }) => [styles.langBtn, pressed && styles.pressed]}
        >
          <Text style={styles.langText}>한국어</Text>
        </Pressable>

        <Pressable
          onPress={() => openConfirm("en")}
          style={({ pressed }) => [styles.langBtn, pressed && styles.pressed]}
        >
          <Text style={styles.langText}>English</Text>
        </Pressable>
      </View>

      {/* ===== 중앙 팝업 모달 ===== */}
      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={cancel}
        statusBarTranslucent // ✅ 상태바 영역까지 오버레이 적용
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalText}>{pendingLang ? message : ""}</Text>

            <View style={styles.modalActions}>
              <Pressable
                onPress={cancel}
                style={({ pressed }) => [
                  styles.modalBtn,
                  styles.cancelBtn,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.cancelText}>취소</Text>
              </Pressable>
              <Pressable
                onPress={confirm}
                style={({ pressed }) => [
                  styles.modalBtn,
                  styles.confirmBtn,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.confirmText}>확인</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },

  // ----- Header -----
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
    fontFamily: "Pretendard-Semibold",
    letterSpacing: -0.3,
  },
  rightIconBox: { width: 26, alignItems: "flex-end" },

  // ----- List -----
  list: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  langBtn: {
    paddingVertical: 14,
  },
  langText: {
    fontSize: 16,
    fontFamily: "Pretendard-Semibold",
  },
  pressed: { opacity: 0.6 },

  // ----- Modal -----
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  modalCard: {
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
  modalText: {
    fontSize: 15,
    marginBottom: 14,
    textAlign: "center",
    fontFamily: "Pretendard-Semibold",
  },
  modalActions: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtn: { backgroundColor: "#EFEFF0" },
  confirmBtn: { backgroundColor: "#FF6B3D" },
  cancelText: {
    fontSize: 15,
    color: "#444",
    fontFamily: "Pretendard-Semibold",
  },
  confirmText: {
    fontSize: 15,
    color: "#fff",
    fontFamily: "Pretendard-Semibold",
  },
});
