import jwt from "jsonwebtoken";
import { Response } from "express";
import prisma from "./database.service";

interface TokenResponse {
	accessToken: string;
	refreshToken: string;
}

/**
 * Generates and returns both an access token and a refresh token for the given user ID.
 * The access token is stored in a cookie with a short expiration time and is used to authenticate the user for most requests.
 * The refresh token is stored in a cookie with a longer expiration time and is used to obtain a new access token when the
 * existing one expires.
 *
 * @param userId - The ID of the user to generate tokens for.
 * @param res - The response object used to set the cookies.
 * @returns An object containing both the access token and the refresh token.
 */
export const generateTokens = async (userId: string, res: Response): Promise<TokenResponse> => {
	// Generate access token
	const accessToken = jwt.sign(
		{ userId },
		process.env.JWT_ACCESS_SECRET!,
		{ expiresIn: "15m" }
	);

	// Generate refresh token
	const refreshToken = jwt.sign(
		{ userId },
		process.env.JWT_REFRESH_SECRET!,
		{ expiresIn: "7d" }
	);

	// Store refresh token in database
	await prisma.user.update({
		where: { id: userId },
		data: { refreshToken }
	});

	// Set cookies
	res.cookie("accessToken", accessToken, {
		maxAge: 15 * 60 * 1000, // 15 minutes
		httpOnly: true,
		sameSite: "strict",
		secure: process.env.NODE_ENV !== "development"
	});

	res.cookie("refreshToken", refreshToken, {
		maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
		httpOnly: true,
		sameSite: "strict",
		secure: process.env.NODE_ENV !== "development"
	});

	return { accessToken, refreshToken };
};

/**
 * Verifies the given access token and returns the associated user ID if valid,
 * or null if invalid.
 *
 * @param token - The access token to verify.
 * @returns The user ID associated with the token, or null if invalid.
 */
export const verifyAccessToken = (token: string): string | null => {
	try {
		const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as { userId: string };
		return decoded.userId;
	} catch (error) {
		return null;
	}
};


/**
 * Verifies the given refresh token and returns the associated user ID if valid,
 * or null if invalid. This function also verifies that the refresh token exists
 * in the database.
 *
 * @param token - The refresh token to verify.
 * @returns The user ID associated with the token, or null if invalid.
 */
export const verifyRefreshToken = async (token: string): Promise<string | null> => {
	try {
		const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as { userId: string };

		// Verify refresh token exists in database
		const user = await prisma.user.findFirst({
			where: {
				id: decoded.userId,
				refreshToken: token
			}
		});

		if (!user) return null;
		return decoded.userId;
	} catch (error) {
		return null;
	}
};

/**
 * Generates a new access token for the given refresh token and sets it in the response.
 * If the refresh token is invalid, returns null.
 *
 * @param refreshToken - The refresh token to generate a new access token for.
 * @param res - The response object to set the new access token in.
 * @returns The new access token, or null if the refresh token is invalid.
 */
export const refreshAccessToken = async (refreshToken: string, res: Response): Promise<string | null> => {
	const userId = await verifyRefreshToken(refreshToken);
	if (!userId) return null;

	const accessToken = jwt.sign(
		{ userId },
		process.env.JWT_ACCESS_SECRET!,
		{ expiresIn: "15m" }
	);

	res.cookie("accessToken", accessToken, {
		maxAge: 15 * 60 * 1000,
		httpOnly: true,
		sameSite: "strict",
		secure: process.env.NODE_ENV !== "development"
	});

	return accessToken;
};

/**
 * Clears all tokens associated with a given user ID from the response cookies
 * and from the database.
 *
 * @param userId - The user ID to clear tokens for.
 * @param res - The response object to clear tokens from.
 * @returns A Promise that resolves when the tokens have been cleared.
 */
export const clearTokens = async (userId: string, res: Response): Promise<void> => {
	// Clear tokens from cookies
	res.cookie("accessToken", "", { maxAge: 0 });
	res.cookie("refreshToken", "", { maxAge: 0 });

	// Clear refresh token from database
	await prisma.user.update({
		where: { id: userId },
		data: { refreshToken: null }
	});
};