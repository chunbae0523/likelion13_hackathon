// app/(tabs)/mypage.tsx
import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, Image, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link, Href, useRouter } from 'expo-router';

const StatBox = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.statItem}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

// 일반 행 (아이콘 있는 경우)
const RowItem = ({ icon, label, href }: { icon: keyof typeof Ionicons.glyphMap; label: string; href: Href }) => {
  const router = useRouter();
  return (
    <Pressable onPress={() => router.push(href)} style={({ pressed }) => [styles.row, pressed && { opacity: 0.6 }]}>
      <View style={styles.rowLeft}>
        <Ionicons name={icon} size={22} />
        <Text style={styles.rowText} numberOfLines={1}>{label}</Text>
      </View>
      <View style={styles.rowRight}>
        <Ionicons name="chevron-forward" size={20} />
      </View>
    </Pressable>
  );
};

// 설정 전용 (아이콘/화살표/구분선 없음)
const SettingsItem = ({ label, href }: { label: string; href: Href }) => {
  const router = useRouter();
  return (
    <Pressable onPress={() => router.push(href)} style={({ pressed }) => [styles.settingsRow, pressed && { opacity: 0.6 }]}>
      <Text style={styles.settingsText} numberOfLines={1}>{label}</Text>
    </Pressable>
  );
};

export default function MyPage() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.title}>마이페이지</Text>
          <View style={styles.headerIcons}>
            <Ionicons name="notifications-outline" size={22} style={styles.headerIcon} />
            <Ionicons name="settings-outline" size={22} />
          </View>
        </View>

        {/* Profile */}
        <View style={styles.profileCard}>
          <Image source={{ uri: 'https://i.pravatar.cc/100?img=3' }} style={styles.avatar} />
          <View style={{ flex: 1 }}>
            <Text style={styles.nickname}>소문이</Text>
            <Text style={styles.username}>@username123</Text>
          </View>
          <Link href="/profile-view" asChild>
            <Pressable style={({ pressed }) => [styles.profileBtn, pressed && { opacity: 0.7 }]}>
              <Text style={styles.profileBtnText}>프로필 보기</Text>
            </Pressable>
          </Link>
        </View>

        {/* Stats */}
        <View style={styles.statCard}>
          <StatBox label="게시물" value="137" />
          <View style={styles.divider} />
          <StatBox label="팔로워" value="7.5만" />
          <View style={styles.divider} />
          <StatBox label="팔로잉" value="5" />
        </View>

        {/* 관심 */}
        <Text style={styles.sectionTitle}>나의 관심</Text>
        <View style={styles.card}>
          <RowItem icon="heart-outline" label="좋아요" href="/likes" />
          <View style={styles.separator} />
          <RowItem icon="chatbubble-ellipses-outline" label="댓글" href="/comments" />
          <View style={styles.separator} />
          <RowItem icon="bookmark-outline" label="스크랩" href="/scraps" />
        </View>

        {/* 활동 */}
        <Text style={styles.sectionTitle}>나의 활동</Text>
        <View style={styles.card}>
          <RowItem icon="document-text-outline" label="내가 작성한 소문" href="/myposts" />
          <View style={styles.separator} />
          <RowItem icon="time-outline" label="최근 본 소문" href="/recently-viewed" />
        </View>

        {/* 설정 */}
        <Text style={styles.sectionTitle}>설정</Text>
        <View style={styles.settingsCard}>
          <SettingsItem label="내 동네 설정" href="/settings/neighborhood" />
          <SettingsItem label="언어설정" href="/settings/language" />
          <SettingsItem label="로그아웃" href="/settings/logout" />
          <SettingsItem label="탈퇴하기" href="/settings/delete-account" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { padding: 16, paddingBottom: 32 },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: { fontSize: 20, fontWeight: '700' },
  headerIcons: { flexDirection: 'row' },
  headerIcon: { marginRight: 16 },

  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#eee',
    marginBottom: 16,
  },
  avatar: { width: 60, height: 60, borderRadius: 30, marginRight: 12, backgroundColor: '#FFD3A3' },
  nickname: { fontSize: 16, fontWeight: '700' },
  username: { color: '#888', marginTop: 2 },
  profileBtn: { backgroundColor: '#F36B3B', paddingHorizontal: 14, paddingVertical: 9, borderRadius: 10 },
  profileBtnText: { color: '#fff', fontWeight: '700', fontSize: 12 },

  statCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F36B3B',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 8,
    marginBottom: 24,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { color: '#fff', fontSize: 18, fontWeight: '800', marginBottom: 4 },
  statLabel: { color: '#fff', fontSize: 12 },
  divider: { width: 1, backgroundColor: 'rgba(255,255,255,0.4)' },

  sectionTitle: { fontSize: 14, fontWeight: '700', marginTop: 12, marginBottom: 10 },

  // 일반 카드(관심/활동)
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#eee',
    marginBottom: 24,
  },

  row: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingLeft: 20,
    paddingRight: 48,
    paddingVertical: 12,
    minHeight: 48,
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  rowRight: {
    position: 'absolute',
    right: 16,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowText: { fontSize: 16, marginLeft: 12, lineHeight: 22 },
  separator: { height: StyleSheet.hairlineWidth, backgroundColor: '#eee', marginLeft: 20 },

  // 설정 (아이콘/화살표/구분선 제거)
  settingsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#eee',
    marginBottom: 24,
    paddingVertical: 4, // 조금의 위아래 여백만
  },
  settingsRow: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  settingsText: {
    fontSize: 16,
    color: '#4A4A4A',
    lineHeight: 22,
  },
});
