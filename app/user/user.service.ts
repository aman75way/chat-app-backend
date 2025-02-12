import bcryptjs from "bcryptjs";
import prisma from "../common/services/database.service";
import { generateTokens, clearTokens } from "../common/services/token.service";
import { UserDTO } from "./user.dto";
import { Role, Gender } from "@prisma/client";

/**
 * Sign up a new user with the given credentials.
 * 
 * @param fullName - The full name of the user.
 * @param email - The email address of the user.
 * @param role - The role of the user (can be either "ADMIN", "GADMIN", or "USER").
 * @param password - The password of the user.
 * @param confirmPassword - The confirmation of the password.
 * @param gender - The gender of the user (can be either "male" or "female").
 * @param res - The Express Response object.
 * 
 * @returns A promise that resolves to the created user object as UserDTO.
 * 
 * @throws {Error} If any of the fields are empty or if the passwords don't match.
 * @throws {Error} If the email already exists.
 */
export const signupService = async (
  fullName: string,
  email: string,
  role: string,
  password: string,
  confirmPassword: string,
  gender: string,
  res: any
): Promise<UserDTO> => {
  if (!fullName || !email || !password || !confirmPassword || !role || !gender) {
    res.status(400);
    throw new Error("All the fields are necessary");
  }

  if (password !== confirmPassword) {
    res.status(400);
    throw new Error("Passwords don't match");
  }

  // Validate role
  if (!Object.values(Role).includes(role as Role)) {
    res.status(400);
    throw new Error("Invalid role");
  }

  // Validate gender
  if (!Object.values(Gender).includes(gender as Gender)) {
    res.status(400);
    throw new Error("Invalid gender");
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    res.status(400);
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcryptjs.hash(password, 10);
  const profilePic = gender === "male"
    ? `https://avatar.iran.liara.run/public/boy?username=${email}`
    : `https://avatar.iran.liara.run/public/girl?username=${email}`;

  const newUser = await prisma.user.create({
    data: {
      fullName,
      email,
      password: hashedPassword,
      role: role as Role,
      gender: gender as Gender,
      profilePic,
      refreshToken: null
    },
  });

  // Generate both access and refresh tokens
  await generateTokens(newUser.id, res);

  return {
    id: newUser.id,
    fullName: newUser.fullName,
    email: newUser.email,
    profilePic: newUser.profilePic,
    role: newUser.role,
    gender: newUser.gender,
    active: newUser.active,
    createdAt: newUser.createdAt.toISOString(),
    updatedAt: newUser.updatedAt.toISOString(),
  };
};

/**
 * Authenticates a user using their email and password.
 * If the credentials are valid, JWT tokens are generated and set in the response.
 *
 * @param email - The email address of the user attempting to log in.
 * @param password - The password provided by the user.
 * @param res - The response object used to set the JWT tokens.
 * @returns A promise that resolves to a UserDTO object containing the user's details.
 * @throws {Error} If authentication fails due to invalid email or password.
 */
export const loginService = async (
  email: string,
  password: string,
  res: any
): Promise<UserDTO> => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcryptjs.compare(password, user.password))) {
    res.status(400);
    throw new Error("Invalid email or password");
  }

  // Generate new access and refresh tokens
  await generateTokens(user.id, res);

  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    profilePic: user.profilePic,
    role: user.role,
    gender: user.gender,
    active: user.active,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
};

/**
 * Logs the user out by clearing the JWT tokens from cookies and database.
 * @param userId The ID of the user to log out
 * @param res The response object
 * @returns A JSON object with a success message
 */
export const logoutService = async (userId: string, res: any) => {
  await clearTokens(userId, res);
  return { message: "Logged out successfully" };
};

/**
 * Retrieves a user's details by their unique user ID.
 * 
 * @param userId - The unique identifier of the user to retrieve.
 * @returns A Promise that resolves to a UserDTO object containing the user's details.
 * @throws {Error} If no user is found with the provided ID.
 */
export const getUserService = async (userId: string): Promise<UserDTO> => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new Error("User not found");
  }

  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    profilePic: user.profilePic,
    role: user.role,
    gender: user.gender,
    active: user.active,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
};