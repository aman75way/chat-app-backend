import { Request, Response, NextFunction } from "express";
import prisma from "../services/database.service";
import { verifyAccessToken, refreshAccessToken } from "../services/token.service";

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
 * Protects a route by verifying the access token and refresh token in the request's cookies.
 * If the access token is invalid, it tries to refresh it using the refresh token.
 * If the access token is valid, it retrieves the user with the corresponding id and stores it in the request object.
 * If any of these steps fail, it sends a 401 status code with an appropriate error message.
 * @param req - The request object
 * @param res - The response object
 * @param next - The next function in the middleware stack
 */
const protectRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken && !refreshToken) {
      return res.status(401).json({ error: "Unauthorized - No tokens provided" });
    }

    // Try to verify access token first
    let userId = accessToken ? verifyAccessToken(accessToken) : null;

    // If access token is invalid but refresh token exists, try to refresh
    if (!userId && refreshToken) {
      const newAccessToken = await refreshAccessToken(refreshToken, res);
      if (!newAccessToken) {
        return res.status(401).json({ error: "Unauthorized - Invalid tokens" });
      }
      userId = verifyAccessToken(newAccessToken);
    }

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized - Invalid tokens" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
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