import {Request, Response} from "express"
import {AuthService} from "./auth.service.js"
import {registerSchema, loginSchema} from "./auth.types.js"


export class AuthController{
  static async register (req:Request, res:Response) {
    try{
      const data = registerSchema.parse(req.body);
      const result = await AuthService.register(data.email, data.password, data.role)
      res.status(201).json(result);
    
    } catch (err: any){
      res.status(400).json({ message:err.message})
    }
}

static async login (req: Request, res: Response) {
  try{
    const data = loginSchema.parse(req.body);
    const result = await AuthService.login(data.email, data.password)
    res.status(200).json(result)
  }catch (err: any){
     res.status(400).json({message:err.message})
  }
}
}
