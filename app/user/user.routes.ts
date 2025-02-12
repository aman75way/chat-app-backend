import { Router } from "express";
import { login, logout, signup, getUser } from "./user.controller";
import protectRouteMiddleware from "../common/middlewares/auth.middleware";
import { catchError } from "../common/helper/catch-error.helper";
import { validateUserSignup } from "./user.validation"; 

const router = Router();

router.post("/login", catchError, login);
router.post("/signup", validateUserSignup, catchError, signup); 
router.post("/logout",protectRouteMiddleware , catchError, logout);
router.get("/", protectRouteMiddleware, catchError, getUser);

export default router;
