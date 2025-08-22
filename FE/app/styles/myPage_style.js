import { StyleSheet } from "react-native";

export default StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { padding: 6, paddingBottom: 32 },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 37,
    marginHorizontal: 16,
  },

  title: { fontSize: 20, fontFamily: "Pretendard-SemiBold" },
  headerIcons: { flexDirection: "row", gap: 20 },

  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 2,
    marginHorizontal: 18,
    borderColor: "#eee",
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 30,
    marginRight: 12,
    backgroundColor: "#FFD3A3",
  },
  nickname: { fontSize: 20, marginRight: 8, fontFamily: "Pretendard-SemiBold" },
  username: {
    color: "#C2C2C2",
    marginTop: 4,
    fontFamily: "Pretendard-Medium",
    fontSize: 12,
  },
  profileBtn: {
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
  },
  badge: {
    backgroundColor: "#EA6844",
    paddingVertical: 4,
    width: 50,
    paddingWidth: 10,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  badgeText: {
    fontSize: 12,
    color: "#ffffffff",
    fontFamily: "Pretendard",
  },

  profileBtnText: {
    color: "#9C9C9C",
    fontSize: 12,
    fontFamily: "Pretendard-SemiBold",
  },

  statCard: {
    flexDirection: "row",
    backgroundColor: "#EA6844",
    height: 88,
    alignItems: "center",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    marginHorizontal: 18,
    marginTop: 22,
  },
  statItem: { flex: 1, alignItems: "center" },
  statValue: {
    color: "#fff",
    fontSize: 20,
    fontFamily: "Pretendard-SemiBold",
    marginBottom: 7,
  },
  statLabel: { color: "#FFF1DE", fontSize: 12 },

  insightCtaBox: {
    marginHorizontal: 18,
    backgroundColor: "#F19469",
    height: 46,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    marginBottom: 44,
    overflow: "hidden",
  },
  insightCta: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  insightCtaText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: 600,
    fontFamily: "Pretendard",
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
