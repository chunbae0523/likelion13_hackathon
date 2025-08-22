// routes.v1/users.js
import { Router } from "express";
const router = Router();

router.get("/search", (req, res) => {
  const { keyword = "" } = req.query;
  const users = [
    { id:"u1", name:"김민수", handle:"minsu" },
    { id:"u2", name:"박서연", handle:"seoyeon" },
    { id:"u3", name:"이현우", handle:"hyunwoo" },
  ].filter(u => u.name.includes(keyword) || u.handle.includes(keyword));
  res.json({ items: users });
});

router.get("/me", (_req, res) => res.json({ id:"me", name:"테스트 유저", avatar:null, bio:"소개글" }));
router.get("/me/likes", (_req, res) => res.json({ items: [] }));
router.get("/me/comments", (_req, res) => res.json({ items: [] }));
router.get("/me/scraps", (_req, res) => res.json({ items: [] }));
router.get("/me/posts", (_req, res) => res.json({ items: [] }));
router.get("/me/recent", (_req, res) => res.json({ items: [] }));
router.patch("/me", (_req, res) => res.json({ ok:true }));

export default router;
