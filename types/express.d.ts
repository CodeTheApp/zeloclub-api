import { USER_TYPES } from "../src/entities/User";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: string;
      userType: USER_TYPES;
    };
  }
}
