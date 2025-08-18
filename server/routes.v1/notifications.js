// routes.v1/notifications.js
import { Router } from "express";
const router = Router();

router.get("/", (_req, res) => {
  res.json({ items:[
    { id:"n1", type:"like",   text:"누군가 내 글을 좋아함", created_at:new Date().toISOString() },
    { id:"n2", type:"follow", text:"새 팔로워가 생김",     created_at:new Date().toISOString() },
  ]});
});

export default router;
