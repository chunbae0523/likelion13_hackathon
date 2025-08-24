import { StyleSheet, Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 30,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  sloganText: {
    fontSize: 24,
    fontFamily: "Pretendard-SemiBold",
    marginBottom: 20,
    color: "#333",
  },

  loginContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    marginBottom: 50,
    marginTop: 30,
    backgroundColor: "#fff",
    width: screenWidth * 0.85,
    borderRadius: 20,
    // iOS 그림자
    shadowColor: "rgba(234, 104, 68, 1)", // 주황색 그림자
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    // 안드로이드 그림자
    elevation: 8,
  },

  loginText: {
    fontSize: 24,
    fontFamily: "Pretendard-Bold",
    color: "#000",
    marginVertical: 30,
  },

  inputContainer: {},

  input: {
    height: 50,
    borderColor: "#C2C2C2",
    borderWidth: 1,
    borderRadius: 50,
    marginVertical: 10,
    fontFamily: "Pretendard-Regular",
    paddingHorizontal: 20,
    fontSize: 16,
  },

  saveLoginButtonContainer: {
    flexDirection: "row",
  },

  saveIcon: {
    flexDirection: "row",
    marginLeft: 5,
  },
  saveLoginText: {
    fontFamily: "Pretendard-Regular",
    fontSize: 14,
    color: "#9C9C9C",
    marginLeft: 5,
    textAlign: "center",
  },

  loginButton: {
    backgroundColor: "#E86844",
    borderRadius: 50,
    height: 50,
    width: screenWidth * 0.8,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },

  loginButtonText: {
    color: "#fff",
    fontFamily: "Pretendard-Bold",
    fontSize: 18,
  },

  extraButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 40,
    marginBottom: 30,
  },

  extraButtonText: {
    fontFamily: "Pretendard-Regular",
    fontSize: 12,
    color: "#9C9C9C",
  },
});
