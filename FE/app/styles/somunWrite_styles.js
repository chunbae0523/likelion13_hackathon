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

  textContainer: {
    width: screenWidth,
    paddingHorizontal: 18,
    flex: 1,
  },

  textInput: {
    fontFamily: "Pretendard-Medium",
    fontSize: 18,
  },

  scrollContainer: {
    width: screenWidth,
    maxHeight: 30,
    marginBottom: 20,
  },

  badgeContainer: {
    flexDirection: "row",
    gap: 13,
    marginLeft: 18,
  },

  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 5,
  },

  newBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EA6844",
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 5,
  },

  selectedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EA6844",
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 5,
  },

  newBadgeText: {
    fontFamily: "Pretendard-Medium",
    fontSize: 14,
    color: "#FFFFFF",
    height: 40,
  },

  badgeText: {
    fontFamily: "Pretendard-Medium",
    fontSize: 14,
    color: "#9C9C9C",
  },

  selectedBadgeText: {
    fontFamily: "Pretendard-Medium",
    fontSize: 14,
    color: "#FFFFFF",
  },

  seperateLine: {
    height: 5,
    backgroundColor: "#F0F0F0",
    width: "100%",
    marginBottom: 18,
  },

  buttonsContainer: {
    gap: 7,
  },

  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginRight: 8,
    marginLeft: 16,
  },

  buttonText: {
    fontFamily: "Pretendard-Medium",
    fontSize: 16,
    color: "#555555",
    marginLeft: 8,
    textAlign: "center",
    marginLeft: 10,
  },

  leftArrow: {
    marginLeft: "auto",
  },

  locationChipContainer: {
    flexDirection: "row",
    gap: 7,
    marginLeft: 18,
    marginBottom: 24,
    marginTop: 4,
  },

  locationChipText: {
    fontFamily: "Pretendard-Medium",
    fontSize: 14,
    color: "#9C9C9C",
    backgroundColor: "#F0F0F0",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },

  postContainer: {
    backgroundColor: "#EA6844",
    marginHorizontal: 18,
    height: 48,
    borderRadius: 10,
    justifyContent: "center",
    alignContent: "center",
    marginBottom: 10,
  },

  postText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 18,
    fontFamily: "Pretendard-SemiBold",
  },
});
