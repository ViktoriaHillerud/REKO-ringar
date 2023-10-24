import jwt from "jsonwebtoken";
import express, { Request, Response, NextFunction } from "express";
import { User } from "../models/userSchema";
import { env } from "process";
require("dotenv").config();

interface JwtPayload {
  _id: string;
}
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
      page?: number;
    }
  }
}

const protectRoute = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const authtoken = authHeader && authHeader.split(" ")[1];
  if (authtoken == null) {
    return res.sendStatus(401);
  }

  jwt.verify(authtoken, process.env.JWT_SECRET as string, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }

    req.user = user as JwtPayload;

    next();
  });
};

export { protectRoute };
