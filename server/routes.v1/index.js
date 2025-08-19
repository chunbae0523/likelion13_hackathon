import { Router } from "express";

import aiRouter from "./ai.js";
import homeRouter from "./home.js";
import locationsRouter from "./locations.js";
import mapRouter from "./map.js";
import notificationsRouter from "./notifications.js";
import placesRouter from "./places.js";
import postsRouter from "./posts.js";
import searchRouter from "./search.js";
import storesRouter from "./stores.js";
import uploadsRouter from "./uploads.js";
import usersRouter from "./users.js";

// 마이페이지 라우터
import mypageRouter from "./mypage.js";

const router = Router();

// ✅ /api/v1/users 밑에 붙이기
router.use("/users", usersRouter);
router.use("/users", mypageRouter);

router.use("/ai", aiRouter);
router.use("/home", homeRouter);
router.use("/locations", locationsRouter);
router.use("/map", mapRouter);
router.use("/notifications", notificationsRouter);
router.use("/posts", postsRouter);
router.use("/search", searchRouter);
router.use("/stores", storesRouter);
router.use("/uploads", uploadsRouter);
router.use("/places", placesRouter);

export default router;
