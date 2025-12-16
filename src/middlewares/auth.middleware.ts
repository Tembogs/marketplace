import {Request, Response, NextFunction} from "express"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "supersecret"

export interface AuthRequest extends Request {
  user?: {userId:string, role:string};
}

export const authMiddleware= (roles: string[] = []) => {
  return (req: AuthRequest, res:Response, next:NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({message: "Not Authorized"})

    const token = authHeader.split('')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as {userId:string, role:string};
      req.user = decoded

      if (roles.length && !roles.includes(decoded.role)){
        return res.status(403).json({message: "Forbidden"})
      }

      next();
    } catch (error: any) {
      res.status(401).json({message : "Invalid token"})
    }
  }
}