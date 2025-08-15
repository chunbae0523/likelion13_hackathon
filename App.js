import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import styles from "./styles.js";
import React, { use, useRef, useState } from "react";
import {
  Text,
  View,
  Image,
  ActivityIndicator,
  Pressable,
  Animated,
  PanResponder
} from "react-native";

export default function App() {
  // 지역명 옆 화살표 애니메이션
  const rotateArrow = useRef(new Animated.Value(0)).current; // 회전값 상태 선언
  const [toggled, setToggled] = useState(false); // 화살표 토글 상태 선언
  const rotateArrowDown = () => {
    // 클릭 시 회전 애니메이션 실행
    Animated.timing(rotateArrow, {
      toValue: toggled ? 0 : 1, // 아래로 100px 이동
      duration: 500, // 0.5초동안 애니메이션
      useNativeDriver: true, // 성능 향상 옵션
    }).start();
    setToggled(!toggled);
  };
  const rotation = rotateArrow.interpolate({
    // rotateArrow값을 0deg~180deg로 변환
    inputRange: [0, 1],
    outputRange: ["360deg", "180deg"],
  });

  // 홈 광고이미지 좌우 이동 애니메이션
  const pan = useRef(new Animated.ValueXY()).current; // 위치를 저장하는 Animated.ValueXY
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true, // 터치 시작 시 panResponder 활성화
      onPanResponderMove: Animated.event(
        [null, {dx: pan.x}],
        { useNativeDriver: false } // 위치값 XY는 nativeDriver 지원 안 함.
      ),
      onPanResponderRelease: () => {
        // 터치 해제 시 애니메이션 초기화
        Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
      },
    })
  ).current;

  // 폰트 로딩
  const [fontsLoaded] = useFonts({
    "Pretendard-Regular": require("./assets/fonts/Pretendard-Regular.ttf"),
    "Pretendard-Bold": require("./assets/fonts/Pretendard-Bold.ttf"),
    "Pretendard-ExtraBold": require("./assets/fonts/Pretendard-ExtraBold.ttf"),
    "Pretendard-Medium": require("./assets/fonts/Pretendard-Medium.ttf"),
    "Pretendard-Light": require("./assets/fonts/Pretendard-Light.ttf"),
    "Pretendard-SemiBold": require("./assets/fonts/Pretendard-SemiBold.ttf"),
  });

  // 폰트 로딩 중에는 로딩 화면 표시
  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBox}>
        <View style={styles.topBoxUpSide}>
          <Image
            source={require("./assets/title.png")}
            style={styles.topBoxTitle}
          />
          <View style={styles.topBoxUpRightside}>
            <Image
              source={require("./assets/search.png")}
              style={styles.topBoxSearch}
            />
            <Image
              source={require("./assets/notice.png")}
              style={styles.topBoxNotification}
            />
          </View>
        </View>

        <View style={styles.topBoxDownSide}>
          <Pressable onPress={rotateArrowDown}>
            <View style={styles.topBoxDownLeftSide}>
              <Text style={styles.locationText}>동작구</Text>
              <Animated.Image
                source={require("./assets/down_arrow.png")}
                style={[
                  styles.topBoxDownArrow,
                  { transform: [{ rotate: rotation }] },
                ]}
              />
            </View>
          </Pressable>

          <View style={styles.topBoxDownRightSide}>
            <Image
              source={require("./assets/my_location.png")}
              style={styles.topBoxMyLocationImg}
            />
            <Text style={styles.topBoxMyLocationText}>내위치</Text>
          </View>
        </View>
        <View style={styles.topToMiddleLine} />
      </View>

      <View style={styles.middleAdBox}>
        <Animated.Image {...panResponder.panHandlers} 
          style={[pan.getLayout(), styles.middleAdImg]}
          source={require("./assets/ad.jpg")} />
          {/* <Image style={styles.middleAdImg} source={require("./assets/ad.jpg")} /> */}
      </View>

      <View style={styles.middleBottomContainer}>
        <View style={styles.middleBox}>
          <View style={styles.middleTop}>
            <Text style={styles.middleTopText}>오늘의 소문</Text>
            <Text style={styles.middleTopShowAll}>전체보기 {">"}</Text>
          </View>
          <View style={styles.middleBottomCase}>
            <View style={styles.middleBottom}>
              <View style={styles.bottomAd}>
                <Image
                  source={require("./assets/ad.jpg")}
                  style={styles.bottomAdImage}
                />
                <View style={styles.eventBox}>
                  <Text style={styles.bottomTodays}>오늘의 축제</Text>
                  <Text style={styles.bottomTodaysDescription}>
                    가족과 함께하는{"\n"}2025 제6회 송도해변축제
                  </Text>
                </View>
                <Image
                  source={require("./assets/left_arrow.png")}
                  style={styles.bottomArrowImage}
                />
              </View>
              <View style={styles.bottomAd}>
                <Image
                  source={require("./assets/ad.jpg")}
                  style={styles.bottomAdImage}
                />
                <View style={styles.eventBox}>
                  <Text style={styles.bottomTodays}>오늘의 행사</Text>
                  <Text style={styles.bottomTodaysDescription}>
                    2025 all Nights Incheon{"\n"}월간 개항장 야간마켓
                  </Text>
                </View>
                <Image
                  source={require("./assets/left_arrow.png")}
                  style={styles.bottomArrowImage}
                />
              </View>
              <View style={styles.bottomAd}>
                <Image
                  source={require("./assets/ad.jpg")}
                  style={styles.bottomAdImage}
                />
                <View style={styles.eventBox}>
                  <Text style={styles.bottomTodays}>오늘의 대회</Text>
                  <Text style={styles.bottomTodaysDescription}>
                    이런저런설명이있는축제
                  </Text>
                </View>
                <Image
                  source={require("./assets/left_arrow.png")}
                  style={styles.bottomArrowImage}
                />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.bottomBox}>
          <View style={styles.bottomBoxButtons}>
            <Pressable onPress={() => console.log("Home Pressed")}>
              <View style={styles.bottomButton}>
                <Image
                  source={require("./assets/home_off.png")}
                  style={styles.bottomHomeIcon}
                />
                <Text style={styles.bottomText}>홈</Text>
              </View>
            </Pressable>
            <Pressable onPress={() => console.log("Community Pressed")}>
              <View style={styles.bottomButton}>
                <Image
                  source={require("./assets/community_off.png")}
                  style={styles.bottomCommunityIcon}
                />
                <Text style={styles.bottomText}>커뮤니티</Text>
              </View>
            </Pressable>
            <Pressable onPress={() => console.log("Map Pressed")}>
              <View style={styles.bottomButton}>
                <Image
                  source={require("./assets/location_off.png")}
                  style={styles.bottomMapIcon}
                />
                <Text style={styles.bottomText}>지도</Text>
              </View>
            </Pressable>
            <Pressable onPress={() => console.log("My Page Pressed")}>
              <View style={styles.bottomButton}>
                <Image
                  source={require("./assets/my_off.png")}
                  style={styles.bottomMyPageIcon}
                />
                <Text style={styles.bottomText}>마이페이지</Text>
              </View>
            </Pressable>
          </View>
        </View>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}
