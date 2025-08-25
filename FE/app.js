// app.js
const express = require("express");
const app = express();
app.use(express.json());

const users = []; // 메모리 DB

// 회원가입
app.post("/api/v1/users", (req, res) => {
  const { email, password } = req.body;
  const exists = users.find(u => u.email === email);
  if (exists) return res.status(400).json({ message: "이미 존재하는 이메일" });

  users.push({ email, password });
  res.json({ message: "회원가입 성공" });
});

// 로그인
app.post("/api/v1/users/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ message: "이메일 또는 비밀번호 오류" });

  res.json({ message: "로그인 성공", user });
});

app.listen(4000, () => console.log("서버 실행중 http://localhost:4000"));
