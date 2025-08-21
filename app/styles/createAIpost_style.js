import { StyleSheet, Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export default StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#ffffffff" },

  header: {
    display: "flex",
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  backBtn: {
    width: 39,
    height: 37,
    marginRight: 6,
    position: "absolute", // 위치를 절대적으로 설정
    left: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontFamily: "Pretendard-SemiBold",
  },

  descriptionContainer: {
    marginTop: 100,
    alignItems: "center",
  },

  descriptionText: {
    fontSize: 22,
    lineHeight: 24,
    textAlign: "center",
    marginTop: 13,
    fontFamily: "Pretendard-SemiBold",
  },

  inputContainer: {
    marginHorizontal: 17,
  },
});
