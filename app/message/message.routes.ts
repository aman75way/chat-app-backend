import express from "express";
import protectRouteMiddleware from "../common/middlewares/auth.middleware";
import { getMessages, getUsersForSidebar, sendMessage } from "./message.controller";
import { catchError } from "../common/helper/catch-error.helper";

const router = express.Router();

router.get("/conversations", protectRouteMiddleware, catchError, getUsersForSidebar);
router.get("/:id", protectRouteMiddleware, catchError, getMessages);
router.post("/send/:id", protectRouteMiddleware, catchError, sendMessage);

export default router;