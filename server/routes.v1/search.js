// routes.v1/search.js
import { Router } from "express";
const router = Router();

router.get("/", (req, res) => {
  const { q = "", limit = 2 } = req.query;
  res.json({
    query: q,
    items: Array.from({ length: Number(limit) }).map((_, i) => ({
      id:`sr${i+1}`, type: i%2 ? "store" : "post", title: `${q} 결과 ${i+1}`
    }))
  });
});

export default router;
