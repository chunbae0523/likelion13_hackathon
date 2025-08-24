import { useFonts } from "expo-font";
import "react-native-gesture-handler";

import Feather from "@expo/vector-icons/Feather";
import { Stack, router, useSegments } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { AppStateProvider } from "../src/context/AppStateContext"; // 공유하는 변수 관리 Context

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Pretendard-Regular": require("../assets/fonts/Pretendard-Regular.ttf"),
    "Pretendard-Bold": require("../assets/fonts/Pretendard-Bold.ttf"),
    "Pretendard-Medium": require("../assets/fonts/Pretendard-Medium.ttf"),
    "Pretendard-Light": require("../assets/fonts/Pretendard-Light.ttf"),
    "Pretendard-Thin": require("../assets/fonts/Pretendard-Thin.ttf"),
    "Pretendard-ExtraBold": require("../assets/fonts/Pretendard-ExtraBold.ttf"),
    "Pretendard-Black": require("../assets/fonts/Pretendard-Black.ttf"),
    "Pretendard-SemiBold": require("../assets/fonts/Pretendard-SemiBold.ttf"),
    "Pretendard-ExtraLight": require("../assets/fonts/Pretendard-ExtraLight.ttf"),
  });

  const segments = useSegments(); // 글쓰기 버튼을 나타낼 경로
  const currentSegment = segments.length > 0 ? segments[0] : "defaultRoute"; // 글쓰기 버튼을 보여줄 경로 배열
  const showWriteButton = ["defaultRoute", "tabs"].includes(currentSegment); // 글쓰기 버튼을 보여줄 경로 배열

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AppStateProvider>
      <View style={{ flex: 1 }}>
        <Stack>
          <Stack.Screen name="tabs" options={{ headerShown: false }} />
        </Stack>

        {showWriteButton && (
          <TouchableOpacity
            style={styles.fab}
            onPress={() => {
              // 버튼 누를 때 동작
              router.push("/(somunWrite)/somunWrite");
              // router.push("/login");
            }}
          >
            <Feather name="feather" size={24} color="white" />
          </TouchableOpacity>
        )}
      </View>
    </AppStateProvider>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 18,
    bottom: 106,
    backgroundColor: "#EA6844",
    borderRadius: 32,
    width: 55,
    height: 55,
    alignItems: "center",
    justifyContent: "center",
    // elevation: 3, // 안드로이드 그림자
    // shadowColor: "#000", // iOS 그림자
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.3,
    // shadowRadius: 4,
  },
});
