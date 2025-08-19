import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Link } from 'expo-router'; // 페이지 이동을 위한 컴포넌트

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* 추천 섹션 */}
      <Text style={styles.sectionTitle}>추천</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalList}>
        {/* 버튼 대신 Link로 페이지 이동 */}
        <Link href="/detail" asChild>
          <TouchableOpacity style={styles.card}>
            <Image source={{ uri: 'https://picsum.photos/200' }} style={styles.cardImage} />
            <Text style={styles.cardTitle}>카페 추천</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/detail" asChild>
          <TouchableOpacity style={styles.card}>
            <Image source={{ uri: 'https://picsum.photos/201' }} style={styles.cardImage} />
            <Text style={styles.cardTitle}>맛집 추천</Text>
          </TouchableOpacity>
        </Link>
      </ScrollView>

      {/* 오늘의 소문 섹션 */}
      <Text style={styles.sectionTitle}>오늘의 소문</Text>
      <Link href="/detail" asChild>
        <TouchableOpacity style={styles.rumorCard}>
          <Image source={{ uri: 'https://picsum.photos/202' }} style={styles.rumorImage} />
          <View style={{ flex: 1 }}>
            <Text style={styles.rumorTitle}>우리 동네 야시장 오늘 개장!</Text>
            <Text style={styles.rumorDesc}>오늘 저녁 6시부터 · 중앙공원</Text>
          </View>
        </TouchableOpacity>
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginVertical: 8 },
  horizontalList: { flexDirection: 'row', marginBottom: 16 },
  card: { width: 120, marginRight: 12 },
  cardImage: { width: '100%', height: 80, borderRadius: 8 },
  cardTitle: { marginTop: 4, fontSize: 14, fontWeight: '500' },
  rumorCard: { flexDirection: 'row', backgroundColor: '#f9fafb', borderRadius: 8, padding: 8, alignItems: 'center' },
  rumorImage: { width: 60, height: 60, borderRadius: 8, marginRight: 8 },
  rumorTitle: { fontSize: 15, fontWeight: 'bold' },
  rumorDesc: { fontSize: 13, color: '#555' },
});
