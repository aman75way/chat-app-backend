import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { signupService, loginService, logoutService, getUserService } from "./user.service";
import { UserDTO } from "./user.dto";

export const signup = asyncHandler(async (req: Request, res: Response) => {
  const { fullName, email, role, password, confirmPassword, gender } = req.body;
  const newUser: UserDTO = await signupService(fullName, email, role, password, confirmPassword, gender, res);
  res.status(201).json(newUser);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user: UserDTO = await loginService(email, password, res);
  res.status(200).json(user);
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const message = await logoutService(res);
  res.status(200).json(message);
});

export const getUser = asyncHandler(async (req: Request, res: Response) => {
  const user: UserDTO = await getUserService(req.user.id);
  res.status(200).json(user);
});
