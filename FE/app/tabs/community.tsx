import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, router } from "expo-router";
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
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// 1) 서버(또는 fake)에서 커뮤니티 글 목록을 가져오는 함수
import {
  fetchPosts,
  /* 선택: */ voteOnPost as _voteOnPost,
} from "../../src/api/communityApi";

// 2) 백엔드가 반환하는 "원시 데이터"의 타입 (명세서 기반)
import type { Post } from "../../.expo/types/community";

// --- (선택) 가짜 투표 API가 없을 때를 대비해 안전한 래퍼 ---
const voteOnPost: undefined | ((id: string, choice: any) => Promise<any>) =
  typeof _voteOnPost === "function" ? _voteOnPost : undefined;

// 기본 폰트 Pretendard-Regular로
(Text as any).defaultProps = {
  ...(Text as any).defaultProps,
  style: [
    ((Text as any).defaultProps && (Text as any).defaultProps.style) || {},
    { fontFamily: "Pretendard-Regular" },
  ],
};

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

// 폴백 아바타 (API에 아바타가 없으므로 기본 이미지 사용)
const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=256&auto=format&fit=crop&q=60";

//numberToK: 1.2K 처럼 숫자 줄여 표시
function numberToK(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return `${n}`;
}
//formatTimeAgo: createdAt(ISO) → "n분 전 / n시간 전 / n일 전"
function formatTimeAgo(isoString: string) {
  const d = new Date(isoString);
  const diff = Date.now() - d.getTime();
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return `${sec}초 전`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}분 전`;
  const hour = Math.floor(min / 60);
  if (hour < 24) return `${hour}시간 전`;
  const day = Math.floor(hour / 24);
  if (day < 7) return `${day}일 전`;
  return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`;
}

type TabType = "latest" | "popular";

// 투표 항목 ID는 두 개(바닐라/말차)만 쓰도록 정의
type PollOptionId = "vanilla" | "matcha";

// --- 백엔드 Post를 느슨하게 확장해서 images/poll을 안전하게 접근하기 위한 로컬 타입 ---
type LoosePost = Post & {
  images?: string[];
  poll?: {
    options: { id: any; label?: string; text?: string; votes: number }[];
    myChoice?: any | null;
  };
};

//"FeedItem": 화면 카드가 원하는 데이터 모양 (프로필/본문/투표/통계/해시태그 등)
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
    photo?: string;
    // ⚠️ API에 투표 정보가 아직 없다면 undefined (UI에서 안전하게 숨김)
    poll?:
      | {
          options: { id: PollOptionId; label: string; votes: number }[];
          myChoice: PollOptionId | null;
        }
      | undefined;
  };
  stats: { likes: number; comments: number; saved: boolean; liked: boolean };
  author: string;
  caption: string;
  hashtags: string[];
};

////////////////////////////////////////////////////////////////////////////////////////////////////
// API → UI 변환 어댑터
// - 백엔드 Post(명세서) → 화면에서 쓰는 FeedItem 으로 변환
// - API가 아직 제공하지 않는 값(avatar, 위치, 구, 투표 등)은 "임시 기본값"으로 안전하게 채움
////////////////////////////////////////////////////////////////////////////////////////////////////
function toFeedItem(raw: Post): FeedItem {
  const p = raw as LoosePost;

  // 1) 사진: Post.images가 있으면 첫 장 사용
  const photo =
    Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : undefined;

  // 2) 투표: 백엔드에 poll이 있으면 최대 2개만 뽑아서 매핑, 없으면 undefined (UI가 자동으로 숨김)
  let poll:
    | {
        options: { id: PollOptionId; label: string; votes: number }[];
        myChoice: PollOptionId | null;
      }
    | undefined;

  if (p.poll && Array.isArray(p.poll.options) && p.poll.options.length >= 2) {
    const o1 = p.poll.options[0];
    const o2 = p.poll.options[1];
    poll = {
      options: [
        {
          id: "vanilla",
          label: (o1.label ?? o1.text ?? "선택 1") as string,
          votes: o1.votes ?? 0,
        },
        {
          id: "matcha",
          label: (o2.label ?? o2.text ?? "선택 2") as string,
          votes: o2.votes ?? 0,
        },
      ],
      myChoice:
        p.poll.myChoice != null
          ? p.poll.myChoice === o1.id
            ? "vanilla"
            : p.poll.myChoice === o2.id
            ? "matcha"
            : null
          : null,
    };
  }
  // 👉 poll이 없으면 undefined: 아래 UI에서 자동으로 안 보임

  return {
    id: (raw as any).id,
    profile: {
      name: (raw as any).authorName ?? "알 수 없음",
      avatar: DEFAULT_AVATAR,
      location: "위치 정보 없음",
      district: "우리동네",
      timeAgo: formatTimeAgo(
        (raw as any).createdAt ?? new Date().toISOString()
      ),
    },
    content: {
      text: (raw as any).content ?? "",
      photo,
      poll, // 없으면 undefined
    },
    stats: {
      likes: (raw as any).likes ?? 0,
      comments: (raw as any).commentsCount ?? 0,
      saved: false, // 서버 연동 전: 로컬 기본값
      liked: false, // 서버 연동 전: 로컬 기본값
    },
    author: (raw as any).authorName ?? "알 수 없음",
    caption: p.caption ?? "", // 백엔드에 별도 캡션 필드 없으면 빈값
    hashtags: ((raw as any).tags ?? []) as string[],
  };
}

//header
const Header: React.FC<{
  district: string;
  onOpenPicker: () => void;
  activeTab: TabType;
  onChangeTab: (t: TabType) => void;
}> = ({ district, onOpenPicker, activeTab, onChangeTab }) => (
  <View
    style={{
      paddingHorizontal: 16,
      paddingTop: 5,
      paddingBottom: 10,
      backgroundColor: COLOR.bg,
    }}
  >
    {/* 상단 타이틀/아이콘 영역 */}
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
        {/* 선택된 구 이름 */}
        <Text
          style={{
            fontFamily: "Pretendard-SemiBold",
            fontSize: 22,
            lineHeight: 28, // 타이틀 블록 높이 통일
            marginRight: 4,
          }}
        >
          {district}
        </Text>
        <Feather name="chevron-down" size={18} color={COLOR.sub} />
      </Pressable>

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
        {/* 알림으로 이동 */}
        <Pressable onPress={() => router.push("/(myPageTabs)/notice")}>
          <Image
            source={require("../../assets/images/notice.png")}
            style={{ width: 23.5, height: 26.5, resizeMode: "contain" }}
          />
        </Pressable>
      </View>
    </View>

    {/* 탭 버튼 */}
    <View style={{ flexDirection: "row", marginTop: 14 }}>
      <Pressable
        style={{ flex: 1, alignItems: "center" }}
        onPress={() => onChangeTab("latest")}
      >
        <Text
          style={{
            fontFamily: "Pretendard-SemiBold",
            fontSize: 18,
            color: activeTab === "latest" ? COLOR.primary : COLOR.sub,
          }}
        >
          최신글
        </Text>
      </Pressable>

      <Pressable
        style={{ flex: 1, alignItems: "center" }}
        onPress={() => onChangeTab("popular")}
      >
        <Text
          style={{
            fontFamily: "Pretendard-SemiBold",
            fontSize: 18,
            color: activeTab === "popular" ? COLOR.primary : COLOR.sub,
          }}
        >
          인기글
        </Text>
      </Pressable>
    </View>

    {/* 탭 인디케이터 (회색 기준선 + 주황 인디케이터) */}
    <View
      style={{
        marginTop: 6,
        height: 0,
        marginHorizontal: -16,
        position: "relative",
      }}
    >
      {/* 회색 기준선 */}
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
      {/* 주황 인디케이터 */}
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

const DistrictPicker: React.FC<{
  visible: boolean;
  onClose: () => void;
  onSelect: (d: string) => void;
}> = ({ visible, onClose, onSelect }) => {
  const items = ["광진구", "용산구", "연수구", "마포구"];
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
            top: Platform.OS === "ios" ? 88 : 76,
            left: 16,
            right: 16,
            backgroundColor: "#fff",
            borderRadius: 12,
            paddingVertical: 8,
            borderWidth: 1,
            borderColor: COLOR.border,
            elevation: 6,
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 4 },
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

/* 투표 바 */
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
        {/* 배경 바 */}
        <View
          style={{
            height: POLL_THIN_H,
            backgroundColor: "#E5E5EA",
            borderRadius: 10,
            overflow: "hidden",
          }}
        >
          {/* 진행 바 */}
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

        {/* 라벨/퍼센트 텍스트 (터치 무시) */}
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

const PostCard: React.FC<{ item: FeedItem }> = ({ item }) => {
  const routerNav = useRouter();
  const [liked, setLiked] = useState(item.stats.liked);

  // 투표 상태 (poll이 없는 카드일 수도 있으니 옵션)
  const [opts, setOpts] = useState(
    item.content.poll?.options ? item.content.poll.options : []
  );
  const [choice, setChoice] = useState<
    FeedItem["content"]["poll"] extends undefined
      ? null
      : NonNullable<FeedItem["content"]["poll"]>["myChoice"]
  >(item.content.poll?.myChoice ?? (null as any));

  // 투표 합계 및 퍼센트 계산 (poll이 있을 때만 의미)
  const total = opts.reduce((s, o) => s + o.votes, 0);
  const p = (id: PollOptionId) =>
    total === 0 ? 0 : (opts.find((o) => o.id === id)!.votes / total) * 100;

  // ✅ 투표 토글 (낙관적 업데이트 + (있으면)가짜 API 동기화)
  const vote = async (id: PollOptionId) => {
    if (!item.content.poll) return;

    // 롤백용 백업
    const prevOpts = opts.map((o) => ({ ...o }));
    const prevChoice = choice;

    // 낙관적 업데이트
    let nextChoice: PollOptionId | null;
    if (choice === id) {
      // 같은 항목을 다시 누르면 취소
      setOpts((prev) => {
        const next = prev.map((o) => ({ ...o }));
        const idx = next.findIndex((o) => o.id === id);
        if (idx >= 0 && next[idx].votes > 0) next[idx].votes -= 1;
        return next;
      });
      nextChoice = null;
      setChoice(null as any);
    } else {
      // 다른 항목을 선택하면 이전 표 -1, 현재 표 +1
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
      nextChoice = id;
      setChoice(id as any);
    }

    // (선택) 가짜 API 동기화 — 없으면 스킵
    if (voteOnPost) {
      try {
        await voteOnPost(item.id, nextChoice as any);
      } catch (e) {
        // 실패 시 롤백
        setOpts(prevOpts);
        setChoice(prevChoice as any);
      }
    }
  };

  return (
    <View style={{ marginTop: 12, marginHorizontal: 12 }}>
      {/* 프로필 영역 */}
      <Pressable
        onPress={() => routerNav.push("/(myPageTabs)/profile")}
        style={{ padding: 12, flexDirection: "row", alignItems: "center" }}
      >
        <Image
          source={{ uri: item.profile.avatar || DEFAULT_AVATAR }}
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

      {/* 투표 바 (poll 있을 때만 표시) */}
      {item.content.poll && (
        <View style={{ paddingHorizontal: 12 }}>
          <PollBarThin
            label={item.content.poll.options[0].label}
            percent={p(item.content.poll.options[0].id)}
            active={choice === item.content.poll.options[0].id}
            onPress={() => vote(item.content.poll!.options[0].id)}
          />
          <PollBarThin
            label={item.content.poll.options[1].label}
            percent={p(item.content.poll.options[1].id)}
            active={choice === item.content.poll.options[1].id}
            onPress={() => vote(item.content.poll!.options[1].id)}
          />
        </View>
      )}

      {/* 이미지 (있을 때만 표시) */}
      {item.content.photo && (
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
      )}

      {/* 액션 영역 (좋아요/댓글/북마크/더보기) */}
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

      {/* 캡션/해시태그 */}
      {(item.caption || item.hashtags.length > 0) && (
        <>
          <View style={{ paddingHorizontal: 12, marginTop: 8 }}>
            {!!item.caption && (
              <Text style={{ color: COLOR.sub, fontSize: 13 }}>
                <Text
                  style={{ color: COLOR.text, fontWeight: "600", fontSize: 13 }}
                >
                  {item.author}
                </Text>
                {"  "}
                {item.caption}
              </Text>
            )}
          </View>

          {item.hashtags.length > 0 && (
            <View
              style={{ paddingHorizontal: 12, marginTop: 10, marginBottom: 6 }}
            >
              <Text style={{ fontSize: 13, color: COLOR.primary }}>
                {item.hashtags
                  .map(
                    (t, i) => `# ${t}${i < item.hashtags.length - 1 ? " " : ""}`
                  )
                  .join("")}
              </Text>
            </View>
          )}
        </>
      )}
    </View>
  );
};

////////////////////////////////////////////////////////////////////////////////////////////////////
// 메인 스크린
////////////////////////////////////////////////////////////////////////////////////////////////////
const CommunityScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [district, setDistrict] = useState("연수구");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [tab, setTab] = useState<TabType>("latest");

  // 서버 데이터 상태
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loadingInit, setLoadingInit] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 최초 로드 (최신글 1페이지)
  useEffect(() => {
    (async () => {
      try {
        setLoadingInit(true);
        const page = await fetchPosts({ limit: 20 });
        setFeed(page.items.map(toFeedItem));
        setCursor(page.nextCursor ?? null);
        setError(null);
      } catch (e: any) {
        setError(e?.message ?? "목록 불러오기 실패");
      } finally {
        setLoadingInit(false);
      }
    })();
  }, []);

  // 새로고침 (맨 처음 페이지 다시 로드)
  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      const page = await fetchPosts({ limit: 20 });
      setFeed(page.items.map(toFeedItem));
      setCursor(page.nextCursor ?? null);
      setError(null);
    } catch (e: any) {
      setError(e?.message ?? "새로고침 실패");
    } finally {
      setRefreshing(false);
    }
  }, []);

  // 다음 페이지 (무한 스크롤)
  const loadMore = useCallback(async () => {
    if (!cursor || loadingMore) return;
    try {
      setLoadingMore(true);
      const page = await fetchPosts({ cursor, limit: 20 });
      setFeed((prev) => [...prev, ...page.items.map(toFeedItem)]);
      setCursor(page.nextCursor ?? null);
    } catch (e) {
      console.warn("loadMore error", e);
    } finally {
      setLoadingMore(false);
    }
  }, [cursor, loadingMore]);

  // 탭별 데이터 구성
  const latestData = feed;
  const popularData = useMemo(
    () => [...feed].sort((a, b) => b.stats.likes - a.stats.likes),
    [feed]
  );
  const data = tab === "latest" ? latestData : popularData;

  // FlatList에 넘길 아이템 렌더러
  const Item = ({ item }: { item: FeedItem }) => <PostCard item={item} />;

  // 최초 로딩 상태
  if (loadingInit && feed.length === 0) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: COLOR.bg,
          paddingTop: insets.top + 12,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator />
        <Text style={{ marginTop: 8, color: COLOR.sub }}>불러오는 중...</Text>
      </SafeAreaView>
    );
  }

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
      />

      {/* 피드 리스트 */}
      <FlatList
        data={data}
        renderItem={Item}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.4}
        ListFooterComponent={
          loadingMore ? (
            <View style={{ paddingVertical: 16 }}>
              <ActivityIndicator />
            </View>
          ) : null
        }
        ListEmptyComponent={
          !loadingInit ? (
            <View style={{ alignItems: "center", marginTop: 40 }}>
              <Text>표시할 글이 없습니다.</Text>
              {!!error && (
                <Text style={{ marginTop: 6, color: "#d00" }}>{error}</Text>
              )}
            </View>
          ) : null
        }
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
