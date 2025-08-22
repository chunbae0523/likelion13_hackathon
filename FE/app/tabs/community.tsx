// community.tsx
import React, { useMemo, useState } from "react";
import { useRouter } from "expo-router";
import { router } from "expo-router";
import {
  View,
  Text,
  Image,
  FlatList,
  Pressable,
  SafeAreaView,
  Platform,
  Modal,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";

/** 모든 Text 기본 폰트를 Pretendard로 */
(Text as any).defaultProps = {
  ...(Text as any).defaultProps,
  style: [
    ((Text as any).defaultProps && (Text as any).defaultProps.style) || {},
    { fontFamily: "Pretendard-Regular" },
  ],
};

// ===== Theme =====
const COLOR = {
  bg: "#ffffff",
  card: "#ffffff",
  border: "#ECECEC",
  text: "#222222",
  sub: "#8A8A8E",
  primary: "#FF6B3D",
  chip: "#FAFAFA",
};

// 투표 얇은 바 높이
const POLL_THIN_H = 50;

// ===== Data =====
const FEED = [
  {
    id: "1",
    profile: {
      name: "소문난 카페",
      avatar:
        "https://images.unsplash.com/photo-1517705008128-361805f42e86?w=256&auto=format&fit=crop&q=60",
      location: "연수구 홍콩로 135",
      district: "연수구",
      timeAgo: "2시간 전",
    },
    content: {
      text: "라떼 메뉴 중 어떤 게 더 끌리시나요??",
      photo:
        "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=1200&auto=format&fit=crop&q=60",
      poll: {
        options: [
          { id: "vanilla" as const, label: "바닐라 라떼", votes: 45 },
          { id: "matcha" as const, label: "말차 라떼", votes: 58 },
        ],
        myChoice: null as null | "vanilla" | "matcha",
      },
    },
    stats: { likes: 1700, comments: 1735, saved: true, liked: false },
    author: "username 123",
    caption: "맛있겠다",
    hashtags: [
      "인천",
      "연수구",
      "소문난 카페",
      "분위기 좋은 카페",
      "카페",
      "바닐라 라떼",
      "말차 라떼",
      "신메뉴",
      "투표",
    ],
  },
];

const FEED_POPULAR = [
  {
    ...FEED[0],
    id: "1-pop",
    content: { ...FEED[0].content, text: "요즘 뭐가 더 핫한가요? (인기글)" },
  },
];

function numberToK(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return `${n}`;
}

type TabType = "latest" | "popular";

const Header: React.FC<{
  district: string;
  onOpenPicker: () => void;
  activeTab: TabType;
  onChangeTab: (t: TabType) => void;
}> = ({ district, onOpenPicker, activeTab, onChangeTab }) => (
  <View
    style={{
      paddingHorizontal: 16,
      paddingTop: 8,
      paddingBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: COLOR.border,
      backgroundColor: COLOR.bg,
    }}
  >
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Pressable
        onPress={onOpenPicker}
        style={{ flexDirection: "row", alignItems: "center" }}
      >
        {/* ✅ 연수구: Pretendard-Semibold, fs 22 */}
        <Text
          style={{
            fontFamily: "Pretendard-SemiBold",
            fontSize: 22,
            marginRight: 4,
          }}
        >
          {district}
        </Text>
        <Feather name="chevron-down" size={18} color={COLOR.sub} />
      </Pressable>
      <View style={{ flexDirection: "row", columnGap: 16 }}>
        <Image
          source={require("../../assets/images/search.png")}
          style={{ width: 22, height: 22 }}
        />
        <Pressable onPress={() => router.push("/(myPageTabs)/notice")}>
          <Image
            source={require("../../assets/images/notice.png")}
            style={{ width: 22, height: 22 }}
          />
        </Pressable>
      </View>
    </View>

    {/* Tabs */}
    <View style={{ flexDirection: "row", marginTop: 14 }}>
      <Pressable
        style={{ flex: 1, alignItems: "center" }}
        onPress={() => onChangeTab("latest")}
      >
        {/* ✅ 최신글: Pretendard-Semibold, fs 18 */}
        <Text
          style={{
            fontFamily: "Pretendard-SemiBold",
            fontSize: 18,
            color: activeTab === "latest" ? COLOR.primary : COLOR.sub,
          }}
        >
          최신글
        </Text>
        <View
          style={{
            height: 2,
            backgroundColor:
              activeTab === "latest" ? COLOR.primary : "transparent",
            marginTop: 6,
            borderRadius: 1,
            alignSelf: "stretch",
          }}
        />
      </Pressable>

      <Pressable
        style={{ flex: 1, alignItems: "center" }}
        onPress={() => onChangeTab("popular")}
      >
        {/* ✅ 인기글: Pretendard-Semibold, fs 18 */}
        <Text
          style={{
            fontFamily: "Pretendard-SemiBold",
            fontSize: 18,
            color: activeTab === "popular" ? COLOR.primary : COLOR.sub,
          }}
        >
          인기글
        </Text>
        <View
          style={{
            height: 2,
            backgroundColor:
              activeTab === "popular" ? COLOR.primary : "transparent",
            marginTop: 6,
            borderRadius: 1,
            alignSelf: "stretch",
          }}
        />
      </Pressable>
    </View>
  </View>
);

const DistrictPicker: React.FC<{
  visible: boolean;
  onClose: () => void;
  onSelect: (d: string) => void;
}> = ({ visible, onClose, onSelect }) => {
  const items = ["광진구", "용산구"];
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.2)" }}
        onPress={onClose}
      >
        <View
          style={{
            position: "absolute",
            top: Platform.OS === "ios" ? 88 : 76,
            left: 16,
            right: 16,
            backgroundColor: "#fff",
            borderRadius: 12,
            paddingVertical: 8,
            borderWidth: 1,
            borderColor: COLOR.border,
            elevation: 6,
          }}
        >
          {items.map((d, idx) => (
            <Pressable
              key={d}
              onPress={() => {
                onSelect(d);
                onClose();
              }}
              style={{ paddingVertical: 12, paddingHorizontal: 14 }}
            >
              <Text style={{ fontSize: 16 }}>{d}</Text>
              {idx < items.length - 1 && (
                <View
                  style={{
                    height: 1,
                    backgroundColor: COLOR.border,
                    marginTop: 12,
                  }}
                />
              )}
            </Pressable>
          ))}
        </View>
      </Pressable>
    </Modal>
  );
};

// ===== Thin Clickable Poll Bar =====
const PollBarThin: React.FC<{
  label: string;
  percent: number;
  active?: boolean;
  onPress?: () => void;
}> = ({ label, percent, active, onPress }) => {
  const RIGHT_R = 10;
  const LEFT_R = percent >= 99.9 ? 10 : 0;
  return (
    <Pressable onPress={onPress} style={{ marginBottom: 12 }}>
      <View style={{ position: "relative" }}>
        <View
          style={{
            height: POLL_THIN_H,
            backgroundColor: "#E5E5EA",
            borderRadius: 10,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              width: `${percent}%`,
              height: "100%",
              backgroundColor: active ? COLOR.primary : "#C7C7CC",
              borderTopRightRadius: RIGHT_R,
              borderBottomRightRadius: RIGHT_R,
              borderTopLeftRadius: LEFT_R,
              borderBottomLeftRadius: LEFT_R,
            }}
          />
        </View>
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            left: 12,
            right: 12,
            top: 0,
            bottom: 0,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* ✅ 바닐라/말차 fs 16 */}
          <Text style={{ fontSize: 16, color: active ? "#ffffff" : "#5C5C5C" }}>
            {label}
          </Text>
          <Text style={{ fontSize: 14, color: active ? "#000000" : "#5C5C5C" }}>
            {percent.toFixed(1)} %
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

// ===== Post Card =====
const PostCard: React.FC<{ item: (typeof FEED)[number] }> = ({ item }) => {
  const router = useRouter();
  const [liked, setLiked] = useState(item.stats.liked);
  const [opts, setOpts] = useState(item.content.poll.options);
  const [choice, setChoice] = useState<typeof item.content.poll.myChoice>(
    item.content.poll.myChoice
  );

  const total = opts.reduce((s, o) => s + o.votes, 0);
  const p = (id: "vanilla" | "matcha") =>
    (opts.find((o) => o.id === id)!.votes / total) * 100;

  const vote = (id: "vanilla" | "matcha") => {
    if (choice === id) {
      setOpts((prev) => {
        const next = prev.map((o) => ({ ...o }));
        const idx = next.findIndex((o) => o.id === id);
        if (idx >= 0 && next[idx].votes > 0) next[idx].votes -= 1;
        return next;
      });
      setChoice(null);
      return;
    }
    setOpts((prev) => {
      const next = prev.map((o) => ({ ...o }));
      if (choice) {
        const prevIdx = next.findIndex((o) => o.id === choice);
        if (prevIdx >= 0 && next[prevIdx].votes > 0) next[prevIdx].votes -= 1;
      }
      const idx = next.findIndex((o) => o.id === id);
      if (idx >= 0) next[idx].votes += 1;
      return next;
    });
    setChoice(id);
  };

  return (
    // 외곽 박스 제거 상태 유지
    <View style={{ marginTop: 12, marginHorizontal: 12 }}>
      {/* 프로필 */}
      <Pressable
        onPress={() => router.push("/(myPageTabs)/profile")}
        style={{ padding: 12, flexDirection: "row", alignItems: "center" }}
      >
        <Image
          source={{ uri: item.profile.avatar }}
          style={{ width: 36, height: 36, borderRadius: 18, marginRight: 10 }}
        />
        <View style={{ flex: 1 }}>
          {/* ✅ 소문난 카페 fs 16 */}
          <Text style={{ fontWeight: "700", fontSize: 16 }}>
            {item.profile.name}
          </Text>
          <Text style={{ color: COLOR.sub, fontSize: 12 }}>
            {item.profile.district} · {item.profile.location}
          </Text>
        </View>
        <Text style={{ color: COLOR.sub, fontSize: 12 }}>
          {item.profile.timeAgo}
        </Text>
      </Pressable>

      <Text style={{ paddingHorizontal: 12, paddingBottom: 10 }}>
        {item.content.text}
      </Text>

      {/* Poll */}
      <View style={{ paddingHorizontal: 12 }}>
        <PollBarThin
          label="바닐라 라떼"
          percent={p("vanilla")}
          active={choice === "vanilla"}
          onPress={() => vote("vanilla")}
        />
        <PollBarThin
          label="말차 라떼"
          percent={p("matcha")}
          active={choice === "matcha"}
          onPress={() => vote("matcha")}
        />
      </View>

      {/* 사진 */}
      <View
        style={{
          marginTop: 6,
          marginHorizontal: 12,
          borderRadius: 12,
          overflow: "hidden",
          borderWidth: 1,
          borderColor: COLOR.border,
        }}
      >
        <Image
          source={{ uri: item.content.photo }}
          style={{ width: "100%", height: 260 }}
        />
      </View>

      {/* Actions */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 12,
          paddingTop: 10,
          columnGap: 18,
        }}
      >
        <Pressable
          onPress={() => setLiked((v) => !v)}
          style={{ flexDirection: "row", alignItems: "center", columnGap: 6 }}
        >
          {liked ? (
            <Ionicons name="heart" size={22} color="#FF3B30" />
          ) : (
            <Ionicons name="heart-outline" size={22} color={COLOR.text} />
          )}
          <Text style={{ color: COLOR.sub }}>
            {numberToK(item.stats.likes + (liked ? 1 : 0))}
          </Text>
        </Pressable>
        <View
          style={{ flexDirection: "row", alignItems: "center", columnGap: 6 }}
        >
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={22}
            color={COLOR.text}
          />
          <Text style={{ color: COLOR.sub }}>
            {numberToK(item.stats.comments)}
          </Text>
        </View>
        <Ionicons
          name={item.stats.saved ? "bookmark" : "bookmark-outline"}
          size={22}
          color={COLOR.text}
        />
        <View style={{ marginLeft: "auto" }}>
          <Feather name="more-horizontal" size={22} color={COLOR.sub} />
        </View>
      </View>

      {/* caption */}
      <View style={{ paddingHorizontal: 12, marginTop: 8 }}>
        {/* ✅ username/caption 동일 크기 13, username 뒤 살짝 띄움 */}
        <Text style={{ color: COLOR.sub, fontSize: 13 }}>
          <Text style={{ color: COLOR.text, fontWeight: "600", fontSize: 13 }}>
            {item.author}
          </Text>
          {"  "}
          {item.caption}
        </Text>
      </View>

      {/* ✅ hashtags: 동일 크기 13 (줄글) */}
      <View style={{ paddingHorizontal: 12, marginTop: 10, marginBottom: 6 }}>
        <Text style={{ fontSize: 13, color: COLOR.primary }}>
          {item.hashtags
            .map((t, i) => `# ${t}${i < item.hashtags.length - 1 ? " " : ""}`)
            .join("")}
        </Text>
      </View>
    </View>
  );
};

// ===== Screen =====
const CommunityScreen: React.FC = () => {
  const [district, setDistrict] = useState("연수구");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [tab, setTab] = useState<TabType>("latest");

  const data = useMemo(() => (tab === "latest" ? FEED : FEED_POPULAR), [tab]);

  const ListHeader = useMemo(
    () => (
      <Header
        district={district}
        onOpenPicker={() => setPickerOpen(true)}
        activeTab={tab}
        onChangeTab={setTab}
      />
    ),
    [district, tab]
  );

  const Item = ({ item }: { item: (typeof FEED)[number] }) => (
    <PostCard item={item} />
  );

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLOR.bg,
        paddingTop: Platform.OS === "ios" ? 36 : 40,
      }}
    >
      <FlatList
        data={data}
        renderItem={Item}
        keyExtractor={(i) => i.id}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      />

      <DistrictPicker
        visible={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(d) => setDistrict(d)}
      />
    </SafeAreaView>
  );
};

export default CommunityScreen;
