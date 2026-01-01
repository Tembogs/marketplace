import prisma from "../../config/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret" 

export class AuthService {
  static async register(
    email:string, 
    password:string,
    role: "USER" | "EXPERT",
    
  ) {
    const existing = await prisma.user.findUnique({where: {email}});
    if (existing) throw new Error("Email already in use");

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email, 
        passwordHash, 
        role,
        expertProfile: role === "EXPERT" 
        ? {
        create: {
          bio: "Welcome! Please update your bio.", // Default bio
          isAvailable: true,
          rating: 0
        }
      } : undefined
      }
    })

    const token = jwt.sign({userId: user.id, role: user.role}, JWT_SECRET, {expiresIn: "7d"})
    return {user, token};
  }


  static async login(
    email:string,
    password:string
  ){
    const user = await prisma.user.findUnique({where: {email}})
  if (!user) throw new Error("Invalid creddntials")

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) throw new Error("Invalid password") 
    
    const token = jwt.sign({userId: user.id, role:user.role}, JWT_SECRET, {expiresIn:"7d"});
    return {user, token}
  }

}