import {Request, Response, NextFunction} from "express"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "supersecret"

export interface AuthRequest extends Request {
  user?: {userId:string, role:string};
}

export const authMiddleware = (roles: string[] = []) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Not Authorized" });

    // FIX: Split by a SPACE ' ' not an empty string ''
    const token = authHeader.split(' ')[1]; 

    if (!token) return res.status(401).json({ message: "Token missing" });

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string, role: string };
      req.user = decoded;

      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
      }

      next(); // Don't forget to call next() to move to the controller!
    } catch (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };
};