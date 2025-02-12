import { Router } from "express";
import userRoutes from "./user/user.routes";
import messageRoutes from "./message/message.routes";

const router = Router();


router.use('/user', userRoutes);
router.use('/message', messageRoutes);


export default router;