import React, { useRef, useState } from "react";
import {
  Animated,
  Image,
  PanResponder,
  Pressable,
  Text,
  View,
  StatusBar,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import styles from "../styles/home_style.js";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomePage() {
  const insets = useSafeAreaInsets(); // 안전 영역 인셋 가져오기

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

  const [dragging, setDragging] = useState(false);

  // 홈 광고이미지 좌우 이동 애니메이션
  const pan = useRef(new Animated.ValueXY()).current; // 위치를 저장하는 Animated.ValueXY
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true, // 터치 시작 시 panResponder 활성화
      onPanResponderGrant: () => {
        setDragging(true); // 드래그 시작 - ScrollView 비활성화
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x }],
        { useNativeDriver: false } // 위치값 XY는 nativeDriver 지원 안 함.
      ),
      onPanResponderRelease: () => {
        setDragging(false); // 드래그 종료 - ScrollView 활성화
        // 터치 해제 시 애니메이션 초기화
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      },
      onPanResponderTerminate: () => {
        setDragging(false); // 드래그 종료 - ScrollView 활성화
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      {/* 상태바 디폴트값 검정 */}
      <StatusBar barStyle="dark-content" />

      <View style={[styles.topBox, { marginTop: insets.top + 8 }]}>
        <View style={styles.topBoxUpSide}>
          <Image
            source={require("../../assets/images/title.png")}
            style={styles.topBoxTitle}
          />
          <View style={styles.topBoxUpRightside}>
            <Image
              source={require("../../assets/images/search.png")}
              style={styles.topBoxSearch}
            />
            <Pressable onPress={() => router.push("/(myPageTabs)/notice")}>
              <Image
                source={require("../../assets/images/notice.png")}
                style={styles.topBoxNotification}
              />
            </Pressable>
          </View>
        </View>

        <View style={styles.topBoxDownSide}>
          <Pressable onPress={rotateArrowDown}>
            <View style={styles.topBoxDownLeftSide}>
              <Text style={styles.locationText}>동작구</Text>
              <Animated.Image
                source={require("../../assets/images/down_arrow.png")}
                style={[
                  styles.topBoxDownArrow,
                  { transform: [{ rotate: rotation }] },
                ]}
              />
            </View>
          </Pressable>

          <View style={styles.topBoxDownRightSide}>
            <Image
              source={require("../../assets/images/my_location.png")}
              style={styles.topBoxMyLocationImg}
            />
            <Text style={styles.topBoxMyLocationText}>내위치</Text>
          </View>
        </View>
        <View style={styles.topToMiddleLine} />
      </View>

      <ScrollView scrollEnabled={!dragging}>
        <View style={styles.middleAdBox}>
          <Animated.View
            style={[pan.getLayout(), styles.middleSemiBox]}
            {...panResponder.panHandlers}
          >
            <Image
              style={styles.middleAdImg}
              source={require("../../assets/images/ad.png")}
              resizeMode="cover"
            />
          </Animated.View>
        </View>

        <View style={styles.middleBottomCase}>
          <View style={styles.middleBox}>
            <View style={styles.middleTop}>
              <Text style={styles.middleTopText}>오늘의 소문</Text>
              <Text style={styles.middleTopShowAll}>전체보기 {">"}</Text>
            </View>
            <View style={styles.middleBottomCase}>
              <View style={styles.middleBottom}>
                <View style={styles.bottomAd}>
                  <Image
                    source={require("../../assets/images/ad.jpg")}
                    style={styles.bottomAdImage}
                  />
                  <View style={styles.eventBox}>
                    <Text style={styles.bottomTodays}>오늘의 축제</Text>
                    <Text style={styles.bottomTodaysDescription}>
                      가족과 함께하는{"\n"}2025 제6회 송도해변축제
                    </Text>
                  </View>
                  <Image
                    source={require("../../assets/images/left_arrow.png")}
                    style={styles.bottomArrowImage}
                  />
                </View>
                <View style={styles.bottomAd}>
                  <Image
                    source={require("../../assets/images/ad.jpg")}
                    style={styles.bottomAdImage}
                  />
                  <View style={styles.eventBox}>
                    <Text style={styles.bottomTodays}>오늘의 행사</Text>
                    <Text style={styles.bottomTodaysDescription}>
                      2025 all Nights Incheon{"\n"}월간 개항장 야간마켓
                    </Text>
                  </View>
                  <Image
                    source={require("../../assets/images/left_arrow.png")}
                    style={styles.bottomArrowImage}
                  />
                </View>
                <View style={styles.bottomAd}>
                  <Image
                    source={require("../../assets/images/ad.jpg")}
                    style={styles.bottomAdImage}
                  />
                  <View style={styles.eventBox}>
                    <Text style={styles.bottomTodays}>오늘의 대회</Text>
                    <Text style={styles.bottomTodaysDescription}>
                      이런저런설명이있는축제
                    </Text>
                  </View>
                  <Image
                    source={require("../../assets/images/left_arrow.png")}
                    style={styles.bottomArrowImage}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
