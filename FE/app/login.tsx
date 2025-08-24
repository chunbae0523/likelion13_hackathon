import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Alert, TouchableOpacity } from "react-native";
import { router, useNavigation } from "expo-router";
import styles from "./styles/login_style";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Import Icons
import TitleIcon from "../assets/images/title.svg";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function AuthScreen() {
  const navigation = useNavigation();

  // 상단 기본 헤더 숨김
  useEffect(() => {
    navigation.setOptions?.({ headerShown: false });
  }, [navigation]);

  const [isLogin, setIsLogin] = useState(true); // 로그인/회원가입 토글

  // 공통
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordDoubleCheck, setPasswordDoubleCheck] = useState("");

  // 회원가입 추가 필드
  const [username, setUsername] = useState("");

  const [loading, setLoading] = useState(false);

  const [isSaveLogin, setIsSaveLogin] = useState(false); // 로그인 상태 유지 토글

  // 가상 회원가입 함수 (로컬 저장 대체용)
  const handleRegister = async () => {
    if (!email || !password || !username) {
      Alert.alert("입력 오류", "모든 필드를 입력해주세요.");
      return;
    }

    setLoading(true);
    try {
      // 실제 API 연동 시 이곳에서 POST 요청 보내기
      // 여기서는 간단히 AsyncStorage에 '사용자 목록'에 저장한다고 가정
      const usersJson = await AsyncStorage.getItem("users");
      const users = usersJson ? JSON.parse(usersJson) : [];

      if (users.some((u: any) => u.email === email)) {
        Alert.alert("회원가입 실패", "이미 등록된 이메일입니다.");
        setLoading(false);
        return;
      }

      users.push({ email, password, username });
      await AsyncStorage.setItem("users", JSON.stringify(users));

      Alert.alert("회원가입 성공", "로그인 해주세요.");
      setIsLogin(true);
    } catch (e) {
      Alert.alert("회원가입 실패", "문제가 발생했습니다.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // 가상 로그인 함수
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("입력 오류", "이메일과 비밀번호를 입력해주세요.");
      return;
    }

    setLoading(true);
    try {
      const usersJson = await AsyncStorage.getItem("users");
      const users = usersJson ? JSON.parse(usersJson) : [];

      const user = users.find(
        (u: any) => u.email === email && u.password === password
      );
      if (!user) {
        Alert.alert("로그인 실패", "아이디 또는 비밀번호가 올바르지 않습니다.");
        setLoading(false);
        return;
      }

      // 로그인 성공 시 토큰(가상) 저장
      await AsyncStorage.setItem("authToken", "fake-jwt-token");

      Alert.alert("로그인 성공", `환영합니다, ${user.username}님!`);
      // TODO: 인증 후 화면 전환 처리
      router.push("/tabs/home");
    } catch (e) {
      Alert.alert("로그인 실패", "문제가 발생했습니다.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TitleIcon width={220} height={100} />
      <Text style={styles.sloganText}>동네가 뜨는 순간, 소문났네</Text>
      <View style={styles.loginContainer}>
        {isLogin ? (
          <View>
            <Text style={styles.loginText}>로그인</Text>
          </View>
        ) : (
          <View>
            <Text style={styles.loginText}>회원가입</Text>
          </View>
        )}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="이메일"
            placeholderTextColor={"#C2C2C2"}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="비밀번호"
            placeholderTextColor={"#C2C2C2"}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          {!isLogin && (
            <TextInput
              style={styles.input}
              placeholder="비밀번호 재입력"
              placeholderTextColor={"#C2C2C2"}
              secureTextEntry
              value={passwordDoubleCheck}
              onChangeText={setPasswordDoubleCheck}
            />
          )}

          {/* 로그인 저장 */}
          {isLogin && (
            <TouchableOpacity
              onPress={() => setIsSaveLogin(!isSaveLogin)}
              activeOpacity={0.8}
            >
              <View style={styles.saveLoginButtonContainer}>
                {isSaveLogin ? (
                  <Ionicons
                    name="checkbox"
                    size={20}
                    color="#E86844"
                    style={styles.saveIcon}
                  />
                ) : (
                  <Ionicons
                    name="checkbox-outline"
                    size={20}
                    color="#9C9C9C"
                    style={styles.saveIcon}
                  />
                )}
                <Text style={styles.saveLoginText}>로그인 저장</Text>
              </View>
            </TouchableOpacity>
          )}

          {/* 로그인 / 회원가입 버튼*/}
          <TouchableOpacity
            onPress={isLogin ? handleLogin : handleRegister}
            activeOpacity={0.8}
          >
            <View style={styles.loginButton}>
              <Text style={styles.loginButtonText}>
                {isLogin ? "로그인" : "회원가입"}
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.extraButtonContainer}>
            <TouchableOpacity
              onPress={() => setIsLogin(!isLogin)}
              activeOpacity={0.8}
            >
              <Text style={styles.extraButtonText}>
                {isLogin ? "회원가입" : "로그인"}
              </Text>
            </TouchableOpacity>
            <Text style={styles.extraButtonText}> | </Text>
            <TouchableOpacity>
              <Text style={styles.extraButtonText}>이메일 찾기</Text>
            </TouchableOpacity>
            <Text style={styles.extraButtonText}> | </Text>
            <TouchableOpacity>
              <Text style={styles.extraButtonText}>비밀번호 찾기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
