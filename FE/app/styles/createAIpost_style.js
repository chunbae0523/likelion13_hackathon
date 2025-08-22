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
    marginVertical: 80,
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
    flex: 1,
    marginHorizontal: 17,
    borderWidth: 1,
    borderColor: "#C2C2C2",
    borderRadius: 10,
  },

  inputText: {
    fontFamily: "Pretendard-Regular",
    fontSize: 14,
    padding: 15,
    color: "#000000",
    textAlignVertical: "top",
    flex: 1,
  },

  inputBottomContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
  },

  imageUploadContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#DEDEDE",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14.5,
    marginHorizontal: 17,
  },

  imageUploadText: {
    fontSize: 12,
    fontFamily: "Pretendard-Regular",
    color: "#9C9C9C",
  },

  textCounter: {
    color: "#C2C2C2",
    fontSize: 12,
    fontFamily: "Pretendard-Regular",
    marginHorizontal: 20,
  },

  createButtonContainer: {
    marginHorizontal: 17,
    marginTop: 50,
    backgroundColor: "#EA6844",
    borderRadius: 10,
    height: 48,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  createButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: "Pretendard-SemiBold",
  },
});
