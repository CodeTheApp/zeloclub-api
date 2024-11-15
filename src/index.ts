import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import "reflect-metadata";
import { AppDataSource } from "./config/ormconfig";

import { auth } from "express-openid-connect";
import applicationRoutes from "./routes/applicationRoutes";
import authRoutes from "./routes/authRoutes";
import careCharacteristicRoutes from "./routes/careCharacteristicRoutes";
import serviceRoutes from "./routes/serviceRoutes";
import userRoutes from "./routes/userRoutes";

const authConfig = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET,
  baseURL: process.env.AUTH0_BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
};

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(auth(authConfig));
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/services", serviceRoutes);
app.use("/application", applicationRoutes);

app.use("/files", express.static(path.resolve(__dirname, "..", "uploads")));
app.use("/api/care-characteristics", careCharacteristicRoutes);
app.get("/", (req, res) => {
  res.send(req.oidc.isAuthenticated() ? "Logged in" : "Logged out");
});

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => console.log(error));
