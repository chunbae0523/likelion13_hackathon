// routes.v1/index.js
import { Router } from "express";

import aiRouter from "./ai.js";
import homeRouter from "./home.js";
import locationsRouter from "./locations.js";
import mapRouter from "./map.js";   // map 라우터 불러오기
import notificationsRouter from "./notifications.js";
import postsRouter from "./posts.js";
import searchRouter from "./search.js";
import storesRouter from "./stores.js";
import uploadsRouter from "./uploads.js";
import usersRouter from "./users.js";

const router = Router();

router.use("/ai", aiRouter);
router.use("/home", homeRouter);
router.use("/locations", locationsRouter);
router.use("/map", mapRouter);   // map 라우터 등록
router.use("/notifications", notificationsRouter);
router.use("/posts", postsRouter);
router.use("/search", searchRouter);
router.use("/stores", storesRouter);
router.use("/uploads", uploadsRouter);
router.use("/users", usersRouter);

export default router;

