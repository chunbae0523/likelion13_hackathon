// server.js 옛날 서버입니다. 사용하지 마쇼
// server/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import path from "path";
import v1Router from "./routes.v1/index.js"; // v1 라우터만 임포트

dotenv.config();

const app = express();

// 기본 미들웨어
app.use(cors());
app.use(bodyParser.json({ limit: "25mb" })); // JSON 바디 최대 25MB

// 헬스체크
app.get("/", (_req, res) => res.send("somun API running"));

// 정적 파일 서빙 (/uploads/이미지파일명 으로 접근)
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// v1 라우터 마운트 (모든 API는 /api/v1 하위로)
app.use("/api/v1", v1Router);

// 404 핸들러(선택)
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// 서버 시작
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`API on http://localhost:${PORT}`);
});
