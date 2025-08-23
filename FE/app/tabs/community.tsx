// community.tsx (refactor: shorter + well-commented)
import React, { useMemo, useState, useCallback } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  Image,
  FlatList,
  Pressable,
  SafeAreaView,
  Platform,
  Modal,
  StatusBar,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/** 모든 Text 기본 폰트를 Pretendard로 */
(Text as any).defaultProps = {
  ...(Text as any).defaultProps,
  style: [
    ((Text as any).defaultProps && (Text as any).defaultProps.style) || {},
    { fontFamily: "Pretendard-Regular" },
  ],
};

/* =========================
 * Theme / Const
 * ======================= */
const COLOR = {
  bg: "#ffffff",
  card: "#ffffff",
  border: "#ECECEC",
  text: "#222222",
  sub: "#8A8A8E",
  primary: "#FF6B3D",
  chip: "#FAFAFA",
};
const POLL_THIN_H = 50;

/* =========================
 * Types
 * ======================= */
type Choice = "vanilla" | "matcha";
type PollOption = { id: Choice; label: string; votes: number };
type FeedItem = {
  id: string;
  profile: {
    name: string;
    avatar: string;
    location: string;
    district: string;
    timeAgo: string;
  };
  content: {
    text: string;
    photo: string;
    poll: { options: PollOption[]; myChoice: Choice | null };
  };
  stats: { likes: number; comments: number; saved: boolean; liked: boolean };
  author: string;
  caption: string;
  hashtags: string[];
};

/* =========================
 * Mock Data (간단화)
 *  - baseItem을 복제해 FEED 구성
 *  - FEED_POPULAR은 텍스트/ID만 살짝 변경
 * ======================= */
const baseItem: FeedItem = {
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
        { id: "vanilla", label: "바닐라 라떼", votes: 45 },
        { id: "matcha", label: "말차 라떼", votes: 58 },
      ],
      myChoice: null,
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
};

// FEED: baseItem + 살짝 다른 id 하나
const FEED: FeedItem[] = [
  baseItem,
  { ...baseItem, id: "2" }, // 내용 같은 카드 1개 더
];

// FEED_POPULAR: 텍스트/ID만 변경
const FEED_POPULAR: FeedItem[] = FEED.map((it) => ({
  ...it,
  id: `${it.id}-pop`,
  content: { ...it.content, text: "요즘 뭐가 더 핫한가요? (인기글)" },
}));

/* =========================
 * Utils
 * ======================= */
const numberToK = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(1)}K` : `${n}`;
type TabType = "latest" | "popular";

/* =========================
 * Header
 *  - 타이틀(연수구) 높이를 홈 타이틀(28)과 동일하게 lineHeight로 강제
 *  - 아이콘 크기/간격은 홈과 동일 세팅
 *  - 아래 인디케이터는 bottom: -10으로 살짝 내림(요구 반영)
 * ======================= */
const Header: React.FC<{
  district: string;
  onOpenPicker: () => void;
  activeTab: TabType;
  onChangeTab: (t: TabType) => void;
  onPressNotice: () => void;
}> = ({ district, onOpenPicker, activeTab, onChangeTab, onPressNotice }) => {
  return (
    <View
      style={{
        paddingHorizontal: 16,
        paddingTop: 5,
        paddingBottom: 10,
        backgroundColor: COLOR.bg,
      }}
    >
      {/* 상단: 좌(지역) - 우(아이콘들) */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginRight: 1.6,
          marginTop: 1,
        }}
      >
        <Pressable
          onPress={onOpenPicker}
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <Text
            style={{
              fontFamily: "Pretendard-SemiBold",
              fontSize: 22,
              lineHeight: 28, // 타이틀 블록 높이 맞춤(홈과 동일)
              marginRight: 4,
            }}
          >
            {district}
          </Text>
          <Feather name="chevron-down" size={18} color={COLOR.sub} />
        </Pressable>

        {/* 오른쪽 아이콘: 검색 / 알림 (홈과 동일 크기/간격) */}
        <View
          style={{ flexDirection: "row", columnGap: 21, alignItems: "center" }}
        >
          <Image
            source={require("../../assets/images/search.png")}
            style={{
              width: 22.1,
              height: 22,
              resizeMode: "contain",
              marginBottom: 1,
              marginRight: -0.5,
            }}
          />
          <Pressable onPress={onPressNotice}>
            <Image
              source={require("../../assets/images/notice.png")}
              style={{ width: 23.5, height: 26.5, resizeMode: "contain" }}
            />
          </Pressable>
        </View>
      </View>

      {/* 탭 버튼 */}
      <View style={{ flexDirection: "row", marginTop: 14 }}>
        {(["latest", "popular"] as TabType[]).map((t) => (
          <Pressable
            key={t}
            style={{ flex: 1, alignItems: "center" }}
            onPress={() => onChangeTab(t)}
          >
            <Text
              style={{
                fontFamily: "Pretendard-SemiBold",
                fontSize: 18,
                color: activeTab === t ? COLOR.primary : COLOR.sub,
              }}
            >
              {t === "latest" ? "최신글" : "인기글"}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* 회색 기준선 + 주황 인디케이터 (같은 y에 두고, -10만큼 내려서 살짝 아래로) */}
      <View
        style={{
          marginTop: 6,
          height: 0,
          marginHorizontal: -16,
          position: "relative",
        }}
      >
        <View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: -10,
            height: 1,
            backgroundColor: COLOR.border,
          }}
        />
        <View
          style={[
            {
              position: "absolute",
              bottom: -10,
              height: 2,
              backgroundColor: COLOR.primary,
            },
            activeTab === "latest"
              ? { left: 0, right: "50%" }
              : { left: "50%", right: 0 },
          ]}
        />
      </View>
    </View>
  );
};

/* =========================
 * DistrictPicker (간단 모달)
 * ======================= */
const DistrictPicker: React.FC<{
  visible: boolean;
  onClose: () => void;
  onSelect: (d: string) => void;
}> = ({ visible, onClose, onSelect }) => {
  const items = ["광진구", "용산구"];
  const top = Platform.OS === "ios" ? 88 : 76;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.2)" }}
        onPress={onClose}
      >
        <View
          style={{
            position: "absolute",
            top,
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

/* =========================
 * PollBarThin (얇은 투표 바)
 *  - active면 주황, 아니면 회색
 *  - percent는 부모에서 계산해 전달
 * ======================= */
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
        {/* 채워지는 바 */}
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

        {/* 라벨 + 퍼센트 (위에 얹기) */}
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

/* =========================
 * PostCard (피드 카드)
 *  - 좋아요 토글
 *  - 투표 선택/해제
 * ======================= */
const PostCard: React.FC<{ item: FeedItem }> = ({ item }) => {
  const router = useRouter();
  const [liked, setLiked] = useState(item.stats.liked);
  const [opts, setOpts] = useState<PollOption[]>(item.content.poll.options);
  const [choice, setChoice] = useState<Choice | null>(
    item.content.poll.myChoice
  );

  const total = opts.reduce((s, o) => s + o.votes, 0);
  const percent = (id: Choice) =>
    (opts.find((o) => o.id === id)!.votes / total) * 100;

  const vote = (id: Choice) => {
    // 같은 옵션을 다시 누르면 취소 / 다른 옵션이면 이전 -1, 새 옵션 +1
    setOpts((prev) => {
      const next = prev.map((o) => ({ ...o }));
      if (choice) {
        const prevIdx = next.findIndex((o) => o.id === choice);
        if (prevIdx >= 0 && next[prevIdx].votes > 0) next[prevIdx].votes -= 1;
      }
      if (choice === id) {
        // 취소 케이스
        setChoice(null);
        return next;
      }
      const idx = next.findIndex((o) => o.id === id);
      if (idx >= 0) next[idx].votes += 1;
      setChoice(id);
      return next;
    });
  };

  return (
    <View style={{ marginTop: 12, marginHorizontal: 12 }}>
      {/* 프로필 라인 */}
      <Pressable
        onPress={() => router.push("/(myPageTabs)/profile")}
        style={{ padding: 12, flexDirection: "row", alignItems: "center" }}
      >
        <Image
          source={{ uri: item.profile.avatar }}
          style={{ width: 36, height: 36, borderRadius: 18, marginRight: 10 }}
        />
        <View style={{ flex: 1 }}>
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

      {/* 본문 텍스트 */}
      <Text style={{ paddingHorizontal: 12, paddingBottom: 10 }}>
        {item.content.text}
      </Text>

      {/* 투표 바 */}
      <View style={{ paddingHorizontal: 12 }}>
        <PollBarThin
          label="바닐라 라떼"
          percent={percent("vanilla")}
          active={choice === "vanilla"}
          onPress={() => vote("vanilla")}
        />
        <PollBarThin
          label="말차 라떼"
          percent={percent("matcha")}
          active={choice === "matcha"}
          onPress={() => vote("matcha")}
        />
      </View>

      {/* 이미지 */}
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

      {/* 액션 바: 좋아요/댓글/북마크/더보기 */}
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

      {/* 캡션 / 해시태그 */}
      <View style={{ paddingHorizontal: 12, marginTop: 8 }}>
        <Text style={{ color: COLOR.sub, fontSize: 13 }}>
          <Text style={{ color: COLOR.text, fontWeight: "600", fontSize: 13 }}>
            {item.author}
          </Text>
          {"  "}
          {item.caption}
        </Text>
      </View>

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

/* =========================
 * Screen
 *  - SafeArea paddingTop은 홈과 비슷하게 insets.top + 12
 *  - renderItem/useCallback으로 불필요한 재생성 방지
 * ======================= */
const CommunityScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [district, setDistrict] = useState("연수구");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [tab, setTab] = useState<TabType>("latest");

  const data = useMemo(() => (tab === "latest" ? FEED : FEED_POPULAR), [tab]);
  const renderItem = useCallback(
    ({ item }: { item: FeedItem }) => <PostCard item={item} />,
    []
  );

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLOR.bg,
        paddingTop: insets.top + 12,
      }}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* 헤더: 리스트 밖에 고정 */}
      <Header
        district={district}
        onOpenPicker={() => setPickerOpen(true)}
        activeTab={tab}
        onChangeTab={setTab}
        onPressNotice={() => router.push("/(myPageTabs)/notice")}
      />

      {/* 피드 */}
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      />

      {/* 구 선택 모달 */}
      <DistrictPicker
        visible={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(d) => setDistrict(d)}
      />
    </SafeAreaView>
  );
};

export default CommunityScreen;
