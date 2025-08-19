// server/index.js
import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import v1Router from "./routes.v1/index.js"; // ★ 이 줄 중요 (경로/확장자 포함)


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/api/v1", v1Router);

// 헬스체크
app.get("/ping", (_req, res) => res.json({ ok: true }));


// 공통 에러 처리 (에러 나면 500으로 응답)
app.use((err, _req, res, _next) => {
  console.error("[SERVER ERROR]", err);
  res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`서버 실행 중! http://localhost:${PORT}`);
});
