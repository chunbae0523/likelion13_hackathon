import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Alert, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from "react-native";
import { router, useNavigation } from "expo-router";
import styles from "./styles/login_style";
import { registerProfile, checkUserLoginByEmail, fetchUserProfiles } from "../src/api/loginApi";

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

  const handleRegister = async () => {
    const emailTrimmed = email.trim(); // ⭐ [FIX]
    const passwordTrimmed = password.trim(); // ⭐ [FIX]

    if (!emailTrimmed || !passwordTrimmed || !username.trim()) {
      Alert.alert("입력 오류", "모든 필드를 입력해주세요.");
      return;
    }

    // ⭐ [ADD] 비밀번호 재확인
    if (passwordTrimmed !== passwordDoubleCheck.trim()) {
      Alert.alert("입력 오류", "비밀번호가 일치하지 않습니다.");
      return;
    }

    setLoading(true);
    const data = await registerProfile(email, username, password);
    if (data === null) { // 회원가입 성공
      Alert.alert("회원가입 오류", "이미 존재하는 이메일입니다.");
    } else {
      Alert.alert("회원가입 성공!", "로그인을 진행해주세요.");
      setIsLogin(true);
    }
    setLoading(false);
    }

  // 가상 로그인 함수
  const handleLogin = async () => {
    const emailTrimmed = email.trim(); // ⭐ [FIX]
    const passwordTrimmed = password.trim(); // ⭐ [FIX]

    if (!emailTrimmed || !passwordTrimmed) {
      Alert.alert("입력 오류", "이메일과 비밀번호를 입력해주세요.");
      return;
    }

    setLoading(true);
    const data = await checkUserLoginByEmail(email, password);
    if (data) { // true면 성공
      Alert.alert("로그인 성공", `환영합니다, ${data.username}님!`);
      router.push("/tabs/home");
    } else {
      Alert.alert("로그인 실패", `잘못된 비밀번호 또는 존재하지 않는 이메일입니다.`);
    }
      setLoading(false);
    }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
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
                    {/* ⭐ [ADD] 회원가입 시 닉네임 입력 */}
          {!isLogin && (
            <TextInput
              style={styles.input}
              placeholder="닉네임"
              placeholderTextColor={"#C2C2C2"}
              value={username}
              onChangeText={setUsername}
            />
          )}
          <TextInput
            style={styles.input}
            placeholder="비밀번호"
            placeholderTextColor={"#C2C2C2"}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {/* 회원가입 시 비밀번호 재입력 */}
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
        </TouchableWithoutFeedback>
  );
}
