import { StatusBar } from "expo-status-bar";
import { Text, View, Image, ActivityIndicator, Pressable } from "react-native";
import { useFonts } from "expo-font";
import styles from "./styles.js";

export default function App() {
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
          <View style={styles.topBoxDownLeftSide}>
            <Text style={styles.locationText}>동작구</Text>
            <Image
              source={require("./assets/down_arrow.png")}
              style={styles.topBoxDownArrow}
            />
          </View>

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
        <Image
          style={styles.middleAdImg}
          source={require("./assets/ad.jpg")}
        />
      </View>

      <View style={styles.middleBottomContainer}>
        <View style={styles.middleBox}>
          <View style={styles.middleTop}>
            <Text style={styles.middleTopText}>오늘의 소문</Text>
            <Text style={styles.middleTopShowAll}>전체보기 {'>'}</Text>
          </View>
          <View style={styles.middleBottomCase}>
            <View style={styles.middleBottom}>
              <View style={styles.bottomAd}>
                <Image 
                source={require("./assets/ad.jpg")}
                style={styles.bottomAdImage} />
                <View style={styles.eventBox}>
                  <Text style={styles.bottomTodays}>오늘의 축제</Text>
                  <Text style={styles.bottomTodaysDescription}>가족과 함께하는{'\n'}2025 제6회 송도해변축제</Text>
                </View>
                <Image 
                source={require("./assets/left_arrow.png")}
                style={styles.bottomArrowImage} />
              </View>
              <View style={styles.bottomAd}>
                <Image 
                source={require("./assets/ad.jpg")}
                style={styles.bottomAdImage} />
                <View style={styles.eventBox}>
                  <Text style={styles.bottomTodays}>오늘의 행사</Text>
                  <Text style={styles.bottomTodaysDescription}>2025 all Nights Incheon{'\n'}월간 개항장 야간마켓</Text>
                </View>
                <Image 
                source={require("./assets/left_arrow.png")}
                style={styles.bottomArrowImage} />
              </View>
              <View style={styles.bottomAd}>
                <Image 
                source={require("./assets/ad.jpg")}
                style={styles.bottomAdImage} />
                <View style={styles.eventBox}>
                  <Text style={styles.bottomTodays}>오늘의 대회</Text>
                  <Text style={styles.bottomTodaysDescription}>이런저런설명이있는축제</Text>
                </View>
                <Image 
                source={require("./assets/left_arrow.png")}
                style={styles.bottomArrowImage} />
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
