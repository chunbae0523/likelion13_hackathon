import { View, Text, StyleSheet, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function DetailPage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>상세 페이지</Text>
      <Text style={styles.desc}>여기에 가게 정보나 이벤트 상세 내용을 넣으면 됩니다.</Text>
      <Button title="뒤로 가기" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  desc: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
});
