import { StyleSheet } from "react-native";

export default StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { padding: 16, paddingBottom: 32 },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  title: { fontSize: 20, fontFamily: "Pretendard-SemiBold" },
  headerIcons: { flexDirection: "row", gap: 20 },
  headerIcon: { marginRight: 16 },

  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#eee",
    marginBottom: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
    backgroundColor: "#FFD3A3",
  },
  nickname: { fontSize: 20, fontFamily: "Pretendard-SemiBold" },
  username: {
    color: "#888",
    marginTop: 2,
    fontFamily: "Pretendard-Medium",
    fontSize: 12,
  },
  profileBtn: {
    backgroundColor: "#F36B3B",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
  },
  profileBtnText: {
    color: "#fff",
    fontSize: 12,
    fontFamily: "Pretendard-SemiBold",
  },

  statCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#F36B3B",
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 8,
    marginBottom: 24,
  },
  statItem: { flex: 1, alignItems: "center" },
  statValue: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Pretendard-SemiBold",
    marginBottom: 4,
  },
  statLabel: { color: "#fff", fontSize: 12 },
  divider: {
    width: 1,
    backgroundColor: "rgba(255,255,255,0.4)",
    fontFamily: "Pretendard-SemiBold",
  },

  sectionTitle: {
    fontSize: 14,
    fontFamily: "Pretendard-SemiBold",
    marginTop: 12,
    marginBottom: 10,
  },

  // 일반 카드(관심/활동)
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#eee",
    marginBottom: 24,
    fontFamily: "Pretendard-SemiBold",
  },

  row: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingLeft: 20,
    paddingRight: 48,
    paddingVertical: 12,
    minHeight: 48,
  },
  rowLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  rowRight: {
    position: "absolute",
    right: 16,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  rowText: {
    fontSize: 16,
    marginLeft: 12,
    lineHeight: 22,
    fontFamily: "Pretendard-SemiBold",
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#eee",
    marginLeft: 20,
    fontFamily: "Pretendard-SemiBold",
  },

  // 설정 (아이콘/화살표/구분선 제거)
  settingsCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#eee",
    marginBottom: 24,
    paddingVertical: 4, // 조금의 위아래 여백만
    fontFamily: "Pretendard-Medium",
    fontSize: 16,
  },
  settingsRow: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  settingsText: {
    fontSize: 16,
    color: "#4A4A4A",
    lineHeight: 22,
    fontFamily: "Pretendard-SemiBold",
  },
});
