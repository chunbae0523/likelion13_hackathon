// app/(tabs)/mypage.tsx
import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, Image, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link, Href } from 'expo-router';

const StatBox = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.statItem}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const RowItem = ({
  icon,
  label,
  href,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  href: Href;
}) => (
  <Link href={href} asChild>
    <Pressable style={({ pressed }) => [styles.row, pressed && { opacity: 0.6 }]}>
      <View style={styles.rowLeft}>
        <Ionicons name={icon} size={20} />
        <Text style={styles.rowText}>{label}</Text>   
      </View>
      <Ionicons name="chevron-forward" size={18} />
    </Pressable>
  </Link>
);

export default function MyPage() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>마이페이지</Text>
          <View style={styles.headerIcons}>
            <Ionicons name="notifications-outline" size={22} style={styles.headerIcon} />
            <Ionicons name="settings-outline" size={22} />
          </View>
        </View>

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

        <View style={styles.statCard}>
          <StatBox label="게시물" value="137" />
          <View style={styles.divider} />
          <StatBox label="팔로워" value="7.5만" />
          <View style={styles.divider} />
          <StatBox label="팔로잉" value="5" />
        </View>

        <Text style={styles.sectionTitle}>나의 관심</Text>
        <View style={styles.card}>
          <RowItem icon="heart-outline" label="좋아요" href="/likes" />
          <View style={styles.separator} />
          <RowItem icon="chatbubble-ellipses-outline" label="댓글" href="/comments" />
          <View style={styles.separator} />
          <RowItem icon="bookmark-outline" label="스크랩" href="/scraps" />
        </View>

        <Text style={styles.sectionTitle}>나의 활동</Text>
        <View style={styles.card}>
          <RowItem icon="document-text-outline" label="내가 작성한 소문" href="/myposts" />
          <View style={styles.separator} />
          <RowItem icon="time-outline" label="최근 본 소문" href="/recently-viewed" />
        </View>

        {/* 설정 */}
        <Text style={styles.sectionTitle}>설정</Text>
        <View style={styles.card}>
            <RowItem icon="location-outline" label="내 동네 설정" href="/settings/neighborhood" />
            <View style={styles.separator} />
            <RowItem icon="language-outline" label="언어설정" href="/settings/language" />
            <View style={styles.separator} />
            <RowItem icon="log-out-outline" label="로그아웃" href="/settings/logout" />
            <View style={styles.separator} />
            <RowItem icon="person-remove-outline" label="탈퇴하기" href="/settings/delete-account" />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { padding: 16, paddingBottom: 32 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  title: { fontSize: 20, fontWeight: '700' },
  headerIcons: { flexDirection: 'row', gap: 12 },
  headerIcon: { marginRight: 8 },

  profileCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    borderRadius: 16, padding: 12, borderWidth: StyleSheet.hairlineWidth, borderColor: '#eee', marginBottom: 12,
  },
  avatar: { width: 56, height: 56, borderRadius: 28, marginRight: 12, backgroundColor: '#FFD3A3' },
  nickname: { fontSize: 16, fontWeight: '700' },
  username: { color: '#888', marginTop: 2 },
  profileBtn: { backgroundColor: '#F36B3B', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  profileBtnText: { color: '#fff', fontWeight: '700', fontSize: 12 },

  statCard: {
    flexDirection: 'row', justifyContent: 'space-between',
    backgroundColor: '#F36B3B', borderRadius: 16, paddingVertical: 16, paddingHorizontal: 8, marginBottom: 20,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { color: '#fff', fontSize: 18, fontWeight: '800', marginBottom: 4 },
  statLabel: { color: '#fff', fontSize: 12 },
  divider: { width: 1, backgroundColor: 'rgba(255,255,255,0.4)' },

  sectionTitle: { fontSize: 14, fontWeight: '700', marginBottom: 8, marginTop: 4 },
  card: { backgroundColor: '#fff', borderRadius: 16, borderWidth: StyleSheet.hairlineWidth, borderColor: '#eee', marginBottom: 20 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, height: 48 },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  rowText: { fontSize: 15 },
  separator: { height: StyleSheet.hairlineWidth, backgroundColor: '#eee', marginLeft: 16 },
  muted: { color: '#999', fontSize: 12, paddingHorizontal: 16 },
});
