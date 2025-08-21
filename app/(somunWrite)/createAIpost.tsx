import React, { useEffect } from "react";
import {
  TextInput,
  View,
  Pressable,
  Text,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { Link, useNavigation } from "expo-router";
import styles from "../styles/createAIpost_style.js"; // Import styles
import { useSafeAreaInsets } from "react-native-safe-area-context";

//icon import
import { Ionicons } from "@expo/vector-icons";

export default function createAIposts() {
  // 상단 기본 헤더 숨김
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions?.({ headerShown: false });
  }, [navigation]);

  const insets = useSafeAreaInsets(); // 안전 영역 인셋 가져오기

  return (
    <SafeAreaView style={styles.safe}>
      {/* 상단 커스텀 헤더 */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Link href="../" asChild>
          <TouchableOpacity hitSlop={10} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={30} color={"#C2C2C2"} />
          </TouchableOpacity>
        </Link>
        <Text style={styles.title}>AI 홍보물 생성</Text>
      </View>
    </SafeAreaView>
  );
}
