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
  nickname: {
    fontSize: 20,
    fontWeight: 600,
    marginRight: 8,
    fontFamily: "Pretendard",
  },
  username: {
    color: "#C2C2C2",
    marginTop: 6,
    fontFamily: "Pretendard",
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
    fontWeight: 500,
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
    fontFamily: "Pretendard",
    fontWeight: 500,
    marginBottom: 7,
  },
  statLabel: { color: "#FFF1DE", fontSize: 14 },

  insightCtaBox: {
    marginHorizontal: 18,
    backgroundColor: "#F19469",
    height: 46,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    marginBottom: 20,
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
    fontSize: 18,
    fontWeight: 600,
    marginTop: 20,
    marginBottom: 10,
    marginHorizontal: 18,
    fontFamily: "Pretendard",
  },

  // 일반 카드(관심/활동)
  card: {
    backgroundColor: "#fff",
    fontColor: "#555",
    marginBottom: 24,
    fontWeight: 500,
    fontSize: 18,
    fontFamily: "Pretendard",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 18,
    marginVertical: 3,
  },

  rowText: {
    fontSize: 16,
    fontFamily: "Pretendard",
    fontColor: "#555555",
  },
  rowLeft: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  separator: {
    height: 2,
    backgroundColor: "#F0F0F0",
    marginHorizontal: 18,

    fontFamily: "Pretendard-SemiBold",
  },

  // 설정 (아이콘/화살표/구분선 제거)
  settingsCard: {
    backgroundColor: "#fff",
    marginBottom: 24,
    fontFamily: "Pretendard",
    fontSize: 16,
  },
  settingsRow: {
    paddingHorizontal: 20,
    marginVertical: 5,
  },
  settingsText: {
    fontSize: 16,
    color: "#9C9C9C",
    fontFamily: "Pretendard",
  },
});
