import { z } from "zod";
import zxcvbn from "zxcvbn";

// Expanded list of common passwords
const commonPasswords = [
  "admin",
  "password",
  "123456",
  "qwerty",
  "abc123",
  "letmein",
  "welcome",
  "monkey",
  "football",
  "dragon",
  "baseball",
  "sunshine",
  "princess"
];

export const signUpSchema = z.object({
  fullName: z
    .string()
    .min(4, "Username must be at least 4 characters")
    .max(10, "Username cannot exceed 10 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores and hyphens"),
  
  email: z
    .string()
    .email("Invalid email address")
    .toLowerCase(),
  
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/\d/, "Password must contain at least one number")
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character"
    )
    .refine(
      (password) => {
        const { score } = zxcvbn(password);
        return score >= 3;
      },
      "Password is too weak"
    )
    .refine(
      (password) => !commonPasswords.includes(password.toLowerCase()),
      "Password is too common"
    ),
}).refine(
  (data) => !data.password.toLowerCase().includes(data.username.toLowerCase()),
  {
    message: "Password cannot contain your username",
    path: ["password"],
  }
);