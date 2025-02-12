import jwt, { JwtPayload } from "jsonwebtoken";

import { Request, Response, NextFunction } from "express";
import prisma from "../services/database.service";

interface DecodedToken extends JwtPayload {
  userId: string;
}

declare global {
  namespace Express {
    export interface Request {
      user: {
        id: string;
      };
    }
  }
}

/**
 * A middleware function that verifies if the user is authenticated.
 * If the user is authenticated, the user details are stored in the request object.
 * If the user is not authenticated, the middleware sends a 401 status code with an appropriate error message.
 * @param req - The request object
 * @param res - The response object
 * @param next - The next function in the middleware stack
 */
const protectRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized - No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized - Invalid Token" });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, fullName: true, profilePic: true },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    req.user = user;

    next();
  } catch (error: any) {
    console.log("Error in protectRoute middleware", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default protectRoute;