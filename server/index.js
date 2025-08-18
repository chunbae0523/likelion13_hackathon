// server/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import v1 from "./routes.v1/index.js";  // 만든 라우터 모음(index.js) 불러오기

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 헬스체크
app.get("/ping", (_req, res) => res.json({ ok: true }));

// /api/v1 아래로 모든 라우터 연결
app.use("/api/v1", v1);

// 공통 에러 처리 (에러 나면 500으로 응답)
app.use((err, _req, res, _next) => {
  console.error("[SERVER ERROR]", err);
  res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`서버 실행 중! http://localhost:${PORT}`);
});
