import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

/**
 * Validation rules for user signup.
 */
export const validateUserSignup = [
  // Validate fullName
  body("fullName")
    .notEmpty().withMessage("Full name is required")
    .isString().withMessage("Full name must be a string")
    .isLength({ min: 3 }).withMessage("Full name must be at least 3 characters long"),

  // Validate email
  body("email")
    .isEmail().withMessage("Invalid email address")
    .normalizeEmail(),

  // Validate password
  body("password")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),

  // Validate confirmPassword
  body("confirmPassword")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords don't match");
      }
      return true;
    }),

  // Validate role
  body("role")
    .isIn(["ADMIN", "GADMIN", "USER"]).withMessage("Invalid role. Allowed roles are: ADMIN, GADMIN, USER"),

  // Validate gender
  body("gender")
    .isIn(["male", "female"]).withMessage("Gender must be either 'male' or 'female'"),

  // Custom validation to reject empty or invalid data
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
