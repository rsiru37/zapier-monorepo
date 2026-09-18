import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "./config.ts";
function authMiddleware(req:Request, res:Response, next:NextFunction) {
  const token = req.headers.authorization?.split(" ")[1];
  console.log("TOKEN", token);
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  else{
    try {
         const payload = jwt.verify(token, JWT_PASSWORD);
        if(payload){
            // @ts-ignore
        req.id = payload.userId;
        next();
     }  
    } catch (error) {
        res.json({ error: error });
        
    }
  }
}

export { authMiddleware };