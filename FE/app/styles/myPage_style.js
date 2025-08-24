import { StyleSheet, Dimensions } from "react-native";

const ORANGE = "#EA6844";
const W = Dimensions.get("window").width;
/* ===== 마이페이지 공용 스타일 ===== */
export const myPage = StyleSheet.create({
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
    fontWeight: "600",
    marginRight: 9,
    fontFamily: "Pretendard",
  },
  username: {
    color: "#C2C2C2",
    marginTop: 6,
    fontFamily: "Pretendard",
    fontSize: 11,
  },
  profileBtn: {
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
  },
  badge: {
    backgroundColor: ORANGE,
    paddingVertical: 4,
    width: 50,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#fff",
    fontFamily: "Pretendard",
  },
  profileBtnText: {
    color: "#9C9C9C",
    fontSize: 12,
    fontFamily: "Pretendard-SemiBold",
  },
  statCard: {
    flexDirection: "row",
    backgroundColor: ORANGE,
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
    fontWeight: "500",
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
    fontWeight: "600",
    fontFamily: "Pretendard",
  },

  divider: {
    justifyContent: "center",
    marginHorizontal: 18,
    marginVertical: 15,
    height: 2,
    backgroundColor: "#F0F0F0",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginHorizontal: 18,
    fontFamily: "Pretendard",
    marginVertical: 10,
  },

  card: {
    backgroundColor: "#fff",
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
    color: "#555555",
  },
  rowLeft: { flexDirection: "row", gap: 10, alignItems: "center" },

  settingsCard: {
    backgroundColor: "#fff",
    marginBottom: 24,
  },
  settingsRow: { paddingHorizontal: 20, marginVertical: 7 },
  settingsText: { fontSize: 16, color: "#9C9C9C", fontFamily: "Pretendard" },
});

/* ===== 인사이트 화면 스타일 (기존 s) ===== */
const insight = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 17,
    backgroundColor: "#fff",
  },
  backBtn: { alignSelf: "flex-start" },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "600",
    color: "#111",
  },

  tabRow: {
    flexDirection: "row",
    justifyContent: "center",
    display: "flex",

    gTop: 6,
    backgroundColor: "#fff",
  },
  tabBtn: {
    flex: 1,
    alignItems: "center",
    position: "relative",
  },
  tabText: {
    fontSize: 18,
    color: "#9C9C9C",
    paddingVertical: 15,
    fontWeight: "600",
  },
  tabTextActive: { color: ORANGE, fontWeight: "600" },
  tabUnderline: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 2,

    backgroundColor: "#F0F0F0",
  },
  tabUnderlineActive: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 2,

    backgroundColor: ORANGE,
  },

  kpiWrap: {
    marginTop: 21,
    backgroundColor: ORANGE,
    borderRadius: 16,
    padding: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  kpiBox: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    marginTop: 4,
  },
  kpiValue: {
    color: "#fff",
    fontFamily: "Pretendard",
    fontSize: 18,
    fontWeight: "500",
    marginVertical: 5,
  },
  kpiLabel: {
    color: "#FFE4DA",
    fontFamily: "Pretendard",
    fontSize: 12,
    fontWeight: "400",
    marginVertical: 5,
  },

  sectionHeader: {
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 35,
    marginBottom: 5,
  },
  sectionTitle: {
    fontFamily: "Pretendard",
    fontSize: 20,
    color: "#000",
    fontWeight: "600",
  },
  sectionDate: {
    fontFamily: "Pretendard",
    color: "#C2C2C2",
    fontSize: 12,
    fontWeight: "400",
  },
  smallDate: {
    color: "#C2C2C2",
    width: "100%",
    fontSize: 12,
    marginBottom: 15,
  },

  Card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    marginHorizontal: 5,
    shadowColor: "rgba(0,0,0,0.4)",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    marginBottom: 3,
    paddingVertical: 3,
    marginVertical: 3,
  },
  chartTabRow: {
    flexDirection: "row",
    marginHorizontal: 25,
    paddingTop: 12,
    marginVertical: 10,
  },
  chartTab: {
    color: "#9C9C9C",
    marginRight: 14,
    fontSize: 13,
    fontFamily: "Pretendard",
    fontWeight: "400",
    fontSize: 14,
  },
  chartTabActive: {
    color: ORANGE,
    fontFamily: "Pretendard",
    fontWeight: 500,
    fontSize: 14,
    borderBottomWidth: 1,
    borderColor: ORANGE,
  },
  bigNumber: {
    fontSize: 28,
    fontWeight: "600",
    fontFamily: "Pretendard",
    color: "#000",
    marginRight: 3,
  },
  unitText: { color: "#9C9C9C", marginTop: 2 },

  chart: { marginHorizontal: 8 },

  rankItem: {
    borderRadius: 14,
    paddingHorizontal: 20,

    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,

    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  rankBadge: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  rankText: {
    fontFamily: "Pretendard",
    fontWeight: "800",
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  thumbnail: {
    width: 73,
    height: 73,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: "#EEE",
  },
  rankTitle: {
    fontFamily: "Pretendard",
    fontSize: 17,
    fontWeight: "600",
    color: "#000",
  },
  rankTags: {
    fontFamily: "Pretendard",
    marginTop: 2,
    fontSize: 12,
    fontWeight: "400",
    color: "#F19469",
  },
  statRow: { flexDirection: "row", marginTop: 10, alignItems: "center" },
  statText: {
    fontSize: 12,
    fontWeight: "400",
    fontFamily: "Pretendard",
    color: "#9C9C9C",
    marginLeft: 5,
    marginRight: 10,
  },

  linkLight: {
    color: "#9C9C9C",
    fontSize: 12,
    alignItems: "center",
    fontFamily: "Pretendard-Medium",
    fontWeight: "500",
  },

  separator: {
    width: 0.5,
    height: 40,
    backgroundColor: "#fff",
    marginVertical: 8,
  },
});

export default insight;
