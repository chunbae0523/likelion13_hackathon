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
    marginTop: 80,
    marginBottom: 40,
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
    marginTop: 40,
    marginBottom: 50,
  },

  inputText: {
    fontFamily: "Pretendard-Regular",
    fontSize: 14,
    padding: 15,
    color: "#000000",
    textAlignVertical: "top",
    flex: 1,
  },

  imageContainer: {
    alignItems: "center",
    marginVertical: 20,
    flex: 2,
    flexDirection: "column",
  },

  imageBox: {
    height: "100%",
    aspectRatio: 1,
    borderRadius: 30,
    backgroundColor: "#C2C2C2",
    overflow: "hidden",
  },

  createdImage: {
    width: "100%",
    height: "100%",
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
    backgroundColor: "#EA6844",
    borderRadius: 10,
    height: 48,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  reCreateButtonContainer: {
    marginHorizontal: 17,
    backgroundColor: "#C2C2C2",
    borderRadius: 10,
    height: 48,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 5,
  },

  createButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: "Pretendard-SemiBold",
  },

  saveButtonContainer: {
    marginHorizontal: 17,
    backgroundColor: "#EA6844",
    borderRadius: 10,
    height: 48,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: "Pretendard-SemiBold",
  },

  modalContainer: {
    width: screenWidth,
    height: screenHeight,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)", // 투명도 있는 검정 배경
  },

  modalBox: {
    width: 300,
    height: 300,
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  makingDesText: {
    textAlign: "center",
    fontSize: 20,
    fontFamily: "Pretendard-SemiBold",
    color: "#000000",
  },

  closeModalButtonContainer: {
    marginTop: 20,
    marginBottom: 50,
    backgroundColor: "#EA6844",
    borderRadius: 10,
    marginHorizontal: 15,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  closeModalText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Pretendard-SemiBold",
  },

  waitingDesText: {
    textAlign: "center",
    fontSize: 13,
    fontFamily: "Pretendard-SemiBold",
    color: "#9C9C9C",
  },

  loadingAnimation: {
    width: 50,
    height: 50,
    marginBottom: 50,
  },
});
