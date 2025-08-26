import { useEffect } from "react";
import { Redirect, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

useEffect(() => {
  const checkAutoLogin = async () => {
    const autoLogin = await AsyncStorage.getItem("autoLogin");
    const uuid = await AsyncStorage.getItem("uuid");
    if (autoLogin === "true" && uuid) {
      // uuid로 유저 정보 가져오기 등 자동 로그인 처리
      router.replace("/tabs/home");
    }
  };
  checkAutoLogin();
}, []);

export default function Index() {
  return <Redirect href="/login" />;
  // return <Redirect href="/tabs/home" />;
}
