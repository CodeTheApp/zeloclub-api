import * as dotenv from "dotenv";
dotenv.config();

import axios from "axios";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthService } from "../services/AuthService";
import {
  sendPasswordChangedNotification,
  sendPasswordResetEmail,
} from "../services/emailService";
import { faker } from "@faker-js/faker";

export class AuthController {
  public static readonly requestPasswordReset = async (
    req: Request,
    res: Response
  ) => {
    const { email } = req.body;

    try {
      const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.isDeleted) {
       res.status(404).json({ message: 'User not found or inactive' });
       return
    }

      const token =
        crypto.randomBytes(3).toString("hex") +
        "-" +
        crypto.randomBytes(3).toString("hex");

      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetPasswordToken: token,
          resetPasswordExpires: new Date(Date.now() + 3600000), // 1 hora
        },
      });

      await sendPasswordResetEmail(user.email, token);

      res.status(200).json({ message: "Password reset email sent" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  public static readonly resetPassword = async (
    req: Request,
    res: Response
  ) => {
    const { token, newPassword } = req.body;

    const passwordPolicy = {
      minLength: 8,
      maxLength: 50,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChar: true,
      allowedSpecialChars: "!@#$%^&*",
    };

    function validatePassword(password: string): boolean {
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumbers = /\d/.test(password);
      const hasSpecialChar = new RegExp(
        `[${passwordPolicy.allowedSpecialChars}]`
      ).test(password);

      return (
        password.length >= passwordPolicy.minLength &&
        password.length <= passwordPolicy.maxLength &&
        hasUpperCase &&
        hasLowerCase &&
        hasNumbers &&
        hasSpecialChar
      );
    }

    try {
      const user = await prisma.user.findFirst({
        where: {
          resetPasswordToken: token,
          resetPasswordExpires: {
            gt: new Date(),
          },
        },
      });

      if (!user) {
        res.status(400).json({ message: "Invalid or expired token" });
        return;
      }
      if (!validatePassword(newPassword)) {
         res.status(400).json({
          message:
            "Password must be between 8-50 characters, including uppercase, lowercase, number, and special character (!@#$%^&*)",
        });
        return
      }
      await prisma.user.update({
        where: { id: user.id },
        data: {
          password: await bcrypt.hash(newPassword, 10),
          resetPasswordToken: null,
          resetPasswordExpires: null,
          updatedAt: new Date(),
        },
      });
      await sendPasswordChangedNotification(user.email);
      res.status(200).json({ message: "Password has been reset successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  public static readonly register = async (req: Request, res: Response) => {
    try {
      const {
        name,
        email,
        password,
        phoneNumber,
        userType,
        description,
        gender,
      } = req.body;

      const user = await AuthService.register(
        name,
        email,
        password,
        phoneNumber,
        userType,
        description,
        gender
      );

      res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
      console.error(error);
      res.status(400).json({
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  public static readonly login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const token = await AuthService.login(email, password);
      res.status(200).json({ message: "Login successful", token });
    } catch (error) {
      console.error(error);
      res.status(400).json({
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  public static readonly me = async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Token is missing or invalid" });
      }
      const token = authHeader.split(" ")[1];
      const user = await AuthService.getUserFromToken(token);
      res.status(200).json({ user });
    } catch (error) {
      console.error(error);
      res.status(400).json({
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  public static readonly auth0Login = async (req: Request, res: Response) => {
    try {
      const { access_token } = req.body;

      const userInfo = await axios.get(`${process.env.AUTH0_ISSUER_BASE_URL}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      const auth0User = userInfo.data;

      const user = await prisma.user.findUnique({
        where: { email: auth0User.email },
      });

      if (!user) {
        throw new Error("User not found");
      }

      res.status(200).json({
        message: "Login successful",
        user: auth0User,
      });
    } catch (error) {
      console.error("Auth0 login error:", error);
      res.status(400).json({
        message:
          error instanceof Error ? error.message : "Authentication failed",
      });
    }
  };
}
