// routes.v1/home.js
import { Router } from "express";
const router = Router();

router.get("/", (req, res) => {
  const { location = "서울", limit = 3, bannerLimit = 4 } = req.query;
  const banners = Array.from({ length: Number(bannerLimit) }).map((_, i) => ({
    id:`bn${i+1}`, title:`${location} 특가 배너 ${i+1}`, image:`/uploads/images/sample-${(i%3)+1}.png`,
  }));
  const today = Array.from({ length: Number(limit) }).map((_, i) => ({
    id:`p${i+1}`, title:`오늘의 소문 ${i+1}`, summary:`${location} 핫딜/이벤트 소식`,
  }));
  res.json({ location, banners, today });
});

export default router;
