import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useRouter } from "expo-router";
import insight from "../styles/myPage_style";
import myPage from "../styles/myPage_style";
const W = Dimensions.get("window").width;

const ORANGE = "#EA6844";

export default function InsightScreen() {
  const router = useRouter();
  const [tab, setTab] = useState<"page" | "region">("page");

  const kpis = [
    { label: "총 게시물", value: "32" },
    { label: "누적 조회수", value: "8,956" },
    { label: "좋아요 수", value: "2,489" },
    { label: "스크랩 수", value: "807" },
  ];

  const ranking = [
    {
      id: "1",
      rank: 1,
      title: "신메뉴 투표 게시물",
      tags: "#투표 #신메뉴 #말차라떼",
      likes: "1.7K",
      comments: "1,735",
      scraps: "7",
      img: require("@/assets/images/matcha_vote.png"),
    },
    {
      id: "2",
      rank: 2,
      title: "말차라떼 제조 게시물",
      tags: "#정성 #제조 #말차라떼",
      likes: "1.5K",
      comments: "1,058",
      scraps: "1",
      img: require("@/assets/images/matcha_make.png"),
    },
    {
      id: "3",
      rank: 3,
      title: "갓 구운 쿠키 게시물",
      tags: "#갓 구운 #초코쿠키 #달콤한",
      likes: "1.1K",
      comments: "956",
      scraps: "713",
      img: require("@/assets/images/cookie.png"),
    },
  ];

  const dataY = [50, 35, 95, 120, 150, 160];
  const labels = [
    "   21일",
    "   22일",
    "   23일",
    "   24일",
    "   25일",
    "   26일",
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView
        style={{ flex: 1, backgroundColor: "#fff" }}
        contentContainerStyle={{
          paddingBottom: 24,
          marginHorizontal: 18,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* 상단 헤더 */}
        <View style={insight.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={insight.backBtn}
          >
            <Image
              source={require("@/assets/images/back_button.png")}
              style={{ width: 39, height: 39 }}
            />
          </TouchableOpacity>
          <Text style={insight.headerTitle}>인사이트</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* 상단 탭 */}
        <View style={insight.tabRow}>
          <TouchableOpacity
            onPress={() => setTab("page")}
            style={insight.tabBtn}
          >
            <Text
              style={[insight.tabText, tab === "page" && insight.tabTextActive]}
            >
              페이지 분석
            </Text>
            <View
              style={[
                tab === "page"
                  ? insight.tabUnderlineActive
                  : insight.tabUnderline,
              ]}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setTab("region")}
            style={insight.tabBtn}
          >
            <Text
              style={[
                insight.tabText,
                tab === "region" && insight.tabTextActive,
              ]}
            >
              지역구 분석
            </Text>
            <View
              style={[
                tab === "region"
                  ? insight.tabUnderlineActive
                  : insight.tabUnderline,
              ]}
            />
          </TouchableOpacity>
        </View>

        {/* KPI 4칸 */}
        <View style={[insight.kpiWrap, { alignItems: "center" }]}>
          {kpis.map((k, i) => (
            <React.Fragment key={i}>
              <View style={insight.kpiBox}>
                <Text style={insight.kpiLabel}>{k.label}</Text>
                <Text style={insight.kpiValue}>{k.value}</Text>
              </View>

              {/* 마지막 요소 뒤에는 구분선 안 넣음 */}
              {i < kpis.length - 1 && <View style={insight.separator} />}
            </React.Fragment>
          ))}
        </View>

        {/* 상세분석 헤더 */}
        <View style={insight.sectionHeader}>
          <Text style={insight.sectionTitle}>상세분석</Text>
          <Text style={insight.sectionDate}>2025.08.26 기준</Text>
        </View>

        {/* 차트 카드 */}
        <View style={[insight.Card, { marginTop: 10 }]}>
          <View style={insight.chartTabRow}>
            <Text style={[insight.chartTab, insight.chartTabActive]}>
              조회수
            </Text>
            <Text style={insight.chartTab}>시간대</Text>
            <Text style={insight.chartTab}>성별/연령별 분포</Text>
          </View>

          <View
            style={{
              marginHorizontal: 25,
              marginVertical: 15,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text style={insight.bigNumber}>116</Text>
            <Text style={insight.unitText}>회</Text>
          </View>

          <LineChart
            data={{ labels, datasets: [{ data: dataY }] }}
            width={W - 70}
            height={220}
            fromZero
            bezier={false}
            segments={4}
            withInnerLines
            withOuterLines={false}
            withVerticalLines={false}
            withShadow={false}
            yLabelsOffset={35}
            style={{
              marginVertical: 10,
            }}
            chartConfig={{
              backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#ffffff",
              color: () => ORANGE,
              labelColor: () => "#B9B9B9",

              propsForBackgroundLines: {
                stroke: "#DEDEDE",
                strokeDasharray: "0",
                strokeWidth: 1,
              },

              decimalPlaces: 0,

              propsForLabels: {
                textAnchor: "start",
              },
              propsForDots: {
                r: "35",
                strokeWidth: "0",
                fill: "transparent",
              },
            }}
            formatYLabel={(y) => (y === "0" ? "" : y)}
            // 마지막 점만 커스텀 렌더

            renderDotContent={({ x, y, index, indexData }) => {
              if (index !== dataY.length - 1) return null;
              return (
                <View
                  key="last-dot"
                  style={{
                    position: "absolute",
                    left: x - 12,
                    top: y - 12,
                    width: 24,
                    height: 24,
                  }}
                >
                  <View
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: 12,
                      backgroundColor: "rgba(234,104,68,0.18)", // Glow
                    }}
                  />
                  <View
                    style={{
                      position: "absolute",
                      left: 4,
                      top: 4,
                      width: 16,
                      height: 16,
                      borderRadius: 18,
                      backgroundColor: "#fff", // 링
                    }}
                  />
                  <View
                    style={{
                      position: "absolute",
                      left: 7,
                      top: 7,
                      width: 10,
                      height: 10,
                      borderRadius: 4,
                      backgroundColor: ORANGE, // 중심 점
                    }}
                  />
                </View>
              );
            }}
          />
        </View>

        {/* 랭킹 헤더 */}
        <View
          style={[
            insight.sectionHeader,
            {
              flexDirection: "row",
              alignItems: "center",
              marginTop: 18,
              width: "100%",
              justifyContent: "space-between",
            },
          ]}
        >
          <View style={insight.sectionHeader}>
            <Text style={insight.sectionTitle}>게시물 랭킹</Text>
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <Text style={insight.linkLight}>전체보기</Text>
              <Image
                source={require("@/assets/images/arrow_right.png")}
                style={{
                  width: 20,
                  height: 25,
                  marginLeft: 5,
                  tintColor: "#C2C2C2",
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={insight.smallDate}>2025.08.26 기준</Text>
        {/* 랭킹 리스트 */}
        <FlatList
          data={ranking}
          keyExtractor={(i) => i.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View style={[insight.Card]}>
              <View
                style={{
                  flexDirection: "row",
                  marginVertical: 15,
                  alignItems: "center",
                }}
              >
                {/* 등수 */}
                <View style={insight.rankBadge}>
                  <Text style={insight.rankText}>{item.rank}</Text>
                  <Image
                    source={require("@/assets/images/increase.png")}
                    style={{ width: 7, height: 7 }}
                  />
                </View>
                <Image />
                {/* 썸네일 */}
                <Image source={item.img} style={insight.thumbnail} />
                {/* 내용 */}
                <View style={{ flex: 1, marginLeft: 5 }}>
                  <Text style={insight.rankTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={insight.rankTags} numberOfLines={1}>
                    {item.tags}
                  </Text>

                  <View style={insight.statRow}>
                    {/* 좋아요 */}
                    <Image
                      source={require("@/assets/images/my_like.png")}
                      style={{
                        width: 17,
                        height: 17,
                        tintColor: "#9C9C9C",
                      }}
                    />
                    <Text style={insight.statText}>{item.likes}</Text>

                    {/* 댓글 */}
                    <Image
                      source={require("@/assets/images/my_comment.png")}
                      style={{ width: 17, height: 17, tintColor: "#9C9C9C" }}
                    />
                    <Text style={insight.statText}>{item.comments}</Text>

                    {/* 스크랩 */}
                    <Image
                      source={require("@/assets/images/my_scrap.png")}
                      style={{ width: 13, height: 13, tintColor: "#9C9C9C" }}
                      resizeMode="contain"
                    />
                    <Text style={insight.statText}>{item.scraps}</Text>
                  </View>
                </View>
                <View>
                  <Image
                    source={require("@/assets/images/arrow_right.png")}
                    style={{
                      width: 30,
                      height: 30,
                      tintColor: "#C2C2C2",
                      marginRight: 15,
                    }}
                    resizeMode="contain"
                  />
                </View>
              </View>
            </View>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
