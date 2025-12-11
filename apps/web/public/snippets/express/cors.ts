import cors from "cors";
import { Express } from "express";

export const configureCors = (app: Express) => {
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN || "*",
      credentials: true,
    })
  );
};
