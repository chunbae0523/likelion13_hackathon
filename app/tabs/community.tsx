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
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";

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

// 투표 얇은 바 높이 (약 2.5배)
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
      // 초기 비율: 45.3 / 57.9 근사
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

// 🔸 인기글 탭에서 보여줄, 글자만 다른 게시물(최소 변경)
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

// ===== Header with District Picker & Tabs =====
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
        <Text style={{ fontSize: 20, fontWeight: "800", marginRight: 4 }}>
          {district}
        </Text>
        <Feather name="chevron-down" size={18} color={COLOR.sub} />
      </Pressable>
      <View style={{ flexDirection: "row", columnGap: 16 }}>
        <Image
          source={require("../../assets/images/search.png")} // 로컬 이미지일 경우
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
        <Text
          style={{
            fontSize: 15,
            fontWeight: "700",
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
        <Text
          style={{
            fontSize: 15,
            fontWeight: "700",
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
  return (
    <Pressable onPress={onPress} style={{ marginBottom: 12 }}>
      <View style={{ position: "relative" }}>
        {/* track (thicker: 50px) */}
        <View
          style={{
            height: POLL_THIN_H,
            backgroundColor: "#E5E5EA",
            borderRadius: 10,
            overflow: "hidden",
          }}
        >
          {/* fill */}
          <View
            style={{
              width: `${percent}%`,
              height: "100%",
              backgroundColor: active ? COLOR.primary : "#C7C7CC",
            }}
          />
        </View>
        {/* overlay labels (left: label, right: percent) */}
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
          <Text
            style={{
              fontSize: 16,
              // 폰트가 없으면 family는 제거해도 됩니다.
              // fontFamily: "Pretendard-Medium",
              color: active ? "#ffffff" : "#5C5C5C",
            }}
          >
            {label}
          </Text>
          <Text
            style={{
              fontSize: 14,
              // fontFamily: "Pretendard-Medium",
              color: active ? "#000000" : "#5C5C5C",
            }}
          >
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

  // 투표: 같은 항목을 한 번 더 누르면 취소 (표 -1, 선택 해제)
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

    // 다른 항목으로 변경: 이전 선택 -1 후 새 항목 +1
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
    <View
      style={{
        backgroundColor: COLOR.card,
        marginHorizontal: 12,
        marginTop: 12,
        borderRadius: 14,
        paddingBottom: 8,
        borderWidth: 1,
        borderColor: COLOR.border,
      }}
    >
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
          <Text style={{ fontWeight: "700" }}>{item.profile.name}</Text>
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

      {/* Poll — only thin bars (tap to vote) */}
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
        <Text style={{ color: COLOR.sub, fontSize: 12 }}>
          <Text style={{ color: COLOR.text, fontWeight: "600" }}>
            {item.author}
          </Text>{" "}
          {item.caption}
        </Text>
      </View>

      {/* hashtags */}
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 6,
          paddingHorizontal: 12,
          marginTop: 10,
          marginBottom: 6,
        }}
      >
        {item.hashtags.map((t) => (
          <View
            key={t}
            style={{
              borderRadius: 8,
              paddingHorizontal: 8,
              paddingVertical: 5,
              backgroundColor: COLOR.chip,
              borderWidth: 1,
              borderColor: COLOR.border,
            }}
          >
            <Text style={{ fontSize: 12, color: COLOR.primary }}># {t}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

// ===== Screen =====
const CommunityScreen: React.FC = () => {
  const [district, setDistrict] = useState("연수구");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [tab, setTab] = useState<TabType>("latest");

  // 🔸 탭에 따라 데이터 선택 (최소 변경)
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
