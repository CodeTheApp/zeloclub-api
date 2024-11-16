import * as dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcrypt";
import crypto from "crypto";
import axios from "axios";
import { Request, Response } from "express";
import { MoreThan } from "typeorm";
import { UserRepository } from "../repositories/UserRepository";
import { AuthService } from "../services/AuthService";
import { User } from "../entities/User";

export class AuthController {
  public static readonly requestPasswordReset = async (
    req: Request,
    res: Response
  ) => {
    const { email } = req.body;

    try {
      const user = await UserRepository.findOne({ where: { email } });
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      const token =
        crypto.randomBytes(3).toString("hex") +
        "-" +
        crypto.randomBytes(3).toString("hex");
      user.resetPasswordToken = token;
      user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hora

      await UserRepository.save(user);

      // Enviar email com o token (implemente este serviço)
      // await sendPasswordResetEmail(user.email, token);

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

    try {
      const user = await UserRepository.findOne({
        where: {
          resetPasswordToken: token,
          resetPasswordExpires: MoreThan(new Date()),
        },
      });

      if (!user) {
        res.status(400).json({ message: "Invalid or expired token" });
        return;
      }

      user.password = await bcrypt.hash(newPassword, 10);
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;

      await UserRepository.save(user);

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
      const { token } = req.body;

      const user = await AuthService.getUserFromToken(token);
      res.status(200).json({ user });
    } catch (error) {
      console.error(error);
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  public static readonly auth0Login = async (req: Request, res: Response) => {
    try {
      const { access_token } = req.body;

      const userInfoResponse = await axios.get(
        `${process.env.AUTH0_ISSUER_BASE_URL}/userinfo`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      const auth0User = userInfoResponse.data;

      let user = await UserRepository.findOne({
        where: { email: auth0User.email },
      });

      if (!user) {
        user = new User();
        user.email = auth0User.email;
        user.name = auth0User.name;
        user.phoneNumber = auth0User.phone_number || null;
        user.avatar = auth0User.picture || null;
        user.completeRegistration = false;
        await UserRepository.save(user);
      }

      if (user.completeRegistration) {
        res.status(200).json({ message: "Login successful", user });
      } else {
        res.status(200).json({
          message: "Please complete your registration.",
          redirectTo: "/complete-registration",
        });
      }
    } catch (error) {
      console.error("Auth0 login error:", error);
      res.status(400).json({
        message:
          error instanceof Error ? error.message : "Authentication failed",
      });
    }
  };

  public static readonly completeRegistration = async (
    req: Request,
    res: Response
  ) => {
    const { userId, phoneNumber, description, avatar } = req.body;

    try {
      const user = await UserRepository.findOne({ where: { id: userId } });

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      user.phoneNumber = phoneNumber;
      user.description = description;
      user.avatar = avatar;
      user.completeRegistration = true;

      await UserRepository.save(user);

      res.status(200).json({ message: "Registration completed successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
}
