import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import styles from "../styles/myPage_style.js";

const screenWidth = Dimensions.get("window").width;

export default function InsightPage() {
  const [tab, setTab] = useState<"page" | "region">("page");

  const stats = [
    { label: "총 게시물", value: 32 },
    { label: "누적 조회수", value: 8956 },
    { label: "좋아요 수", value: 2489 },
    { label: "스크랩 수", value: 807 },
  ];

  /** 통계 박스 */
  const StatBox = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.statItem}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  const ranking = [
    {
      id: "1",
      title: "신메뉴 투표 게시물",
      hashtags: "#투표 #신메뉴 #말차라떼",
      img: require("@/assets/images/matcha_vote.png"),
      likes: 1700,
      comments: 1735,
    },
    {
      id: "2",
      title: "말차라떼 제조 게시물",
      hashtags: "#청성 #제조 #말차라떼",
      img: require("@/assets/images/matcha_make.png"),
      likes: 1500,
      comments: 1058,
    },
  ];

  return (
    <View>
      <View style={s.container}>
        <Text style={[s.tabText, tab === "page" && s.activeTab]}>
          페이지 분석
        </Text>
        <Text style={[s.tabText, tab === "region" && s.activeTab]}>
          지역구 분석
        </Text>
      </View>

      {/* KPI 카드 */}
      {/* <View style={s.statsGrid}>
        {stats.map((sItem, idx) => (
          <View key={idx} style={s.statCard}>
            <Text style={s.statValue}>{sItem.value}</Text>
            <Text style={s.statLabel}>{sItem.label}</Text>
          </View>
        ))}
      </View> */}

      {/* Stats */}
      <View style={styles.statCard}>
        <StatBox label="게시물" value="137" />
        <View style={styles.divider} />
        <StatBox label="팔로워" value="7.5만" />
        <View style={styles.divider} />
        <StatBox label="팔로잉" value="5" />
      </View>

      {/* 차트 */}
      <LineChart
        data={{
          labels: ["21일", "22일", "23일", "24일", "25일", "26일"],
          datasets: [{ data: [40, 50, 60, 45, 100, 116] }],
        }}
        width={screenWidth - 30}
        height={200}
        chartConfig={{
          backgroundColor: "#fff",
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          color: () => "#EA6844",
        }}
        bezier
        style={{ marginVertical: 8, borderRadius: 16 }}
      />

      {/* 랭킹 리스트 */}
      <FlatList
        data={ranking}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={s.rankCard}>
            <Image source={item.img} style={s.thumb} />
            <View style={{ flex: 1 }}>
              <Text style={s.rankTitle}>{item.title}</Text>
              <Text style={s.rankTags}>{item.hashtags}</Text>
              <Text>
                ❤️ {item.likes} 💬 {item.comments}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  tabText: { fontSize: 16, color: "#999" },
  activeTab: {
    fontWeight: "bold",
    color: "#EA6844",
    borderBottomWidth: 2,
    borderColor: "#EA6844",
  },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", marginVertical: 12 },
  statCard: { width: "50%", padding: 12 },
  statValue: { fontSize: 20, fontWeight: "bold", color: "#EA6844" },
  statLabel: { fontSize: 14, color: "#555" },
  rankCard: {
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  thumb: { width: 60, height: 60, borderRadius: 8, marginRight: 12 },
  rankTitle: { fontSize: 16, fontWeight: "bold" },
  rankTags: { color: "#888", fontSize: 13, marginBottom: 4 },
});
