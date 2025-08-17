import { useFonts } from "expo-font";
import { Stack } from "expo-router";

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
    <Stack>
      <Stack.Screen
        name="tabs"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}