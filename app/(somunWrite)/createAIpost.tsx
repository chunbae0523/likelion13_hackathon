import React, { useEffect } from "react";
import {
  TextInput,
  View,
  Pressable,
  Text,
  TouchableOpacity,
} from "react-native";
import { Link, useNavigation } from "expo-router";
import styles from "../styles/createAIpost_style.js"; // Import styles
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Import Icons
import TitleIcon from "../../assets/images/title.svg";
import { Ionicons } from "@expo/vector-icons";

export default function createAIposts() {
  // 상단 기본 헤더 숨김
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions?.({ headerShown: false });
  }, [navigation]);

  const insets = useSafeAreaInsets(); // 안전 영역 인셋 가져오기

  // 입력값 상태 관리
  const [text, setText] = React.useState("");
  const maxLength = 20; // 최대 글자 수
  const onChangeText = (input: string) => {
    if (input.length <= maxLength) {
      setText(input);
    }
  };

  return (
    <View style={[styles.safe, { paddingTop: insets.top + 8 }]}>
      {/* 상단 커스텀 헤더 */}
      <View style={[styles.header, { marginTop: 8 }]}>
        <Link href="../" asChild>
          <TouchableOpacity hitSlop={10} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={30} color={"#C2C2C2"} />
          </TouchableOpacity>
        </Link>
        <Text style={styles.title}>AI 홍보물 생성</Text>
      </View>

      {/* 중앙 홍보물 생성 안내글 */}
      <View style={styles.descriptionContainer}>
        <TitleIcon width={114} height={32} />
        <Text style={styles.descriptionText}>어떤 AI 홍보물을 생성할까요?</Text>
      </View>

      {/* 중앙 입력란 */}
      <View style={styles.inputContainer}>
        <View style={styles.inputTextContainer}>
          <TextInput
            style={styles.input}
            placeholder="AI 홍보물 내용을 입력하세요."
            value={text}
            onChangeText={onChangeText}
            multiline
          />
        </View>
        <View style={styles.inputBottomContainer}></View>
      </View>

      {/* 생성하기 버튼 */}
      <View style={styles.createButtonContainer}>
        <Pressable style={styles.createButton}>
          <Text style={styles.createButtonText}>생성하기</Text>
        </Pressable>
      </View>
    </View>
  );
}
