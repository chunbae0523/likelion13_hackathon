import { StyleSheet, Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export default StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#ffffffff" },

  header: {
    paddingHorizontal: 12,
    paddingBottom: 24, // 제목-그리드 여백
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  backBtn: {
    width: 39,
    height: 37,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
    position: "absolute", // 위치를 절대적으로 설정
    left: 4,
  },
  title: {
    textAlign: "center",
    fontSize: 20,
    fontFamily: "Pretendard-SemiBold",
    marginTop: 10,
  },
});
