import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,                    // 화면 전체 사용
    flexDirection: 'column',    // 세로 방향 배치
    margin: 20,
  },
  box: {
    justifyContent: 'center',   // 세로축 중앙 정렬
    alignItems: 'center',       // 가로축 중앙 정렬
    marginVertical: 5,
  },
  text: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});