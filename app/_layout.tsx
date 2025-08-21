import { useFonts } from "expo-font";
import { Stack, Slot } from "expo-router";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import Feather from '@expo/vector-icons/Feather';

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

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="tabs" options={{ headerShown: false }} />
      </Stack>
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          // 버튼 누를 때 동작
        }}
      >
        <Feather name="feather" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 24,
    bottom: 40,
    backgroundColor: "#007AFF",
    borderRadius: 32,
    width: 55,
    height: 55,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5, // 안드로이드 그림자
    shadowColor: "#000", // iOS 그림자
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});