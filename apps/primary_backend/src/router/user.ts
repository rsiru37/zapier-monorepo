import Router from 'express'
import { authMiddleware } from '../middleware.ts'
import { loginSchema, signupSchema } from "@repo/types"
import {pcl} from "@repo/db"
import jwt from "jsonwebtoken"
import { JWT_PASSWORD } from '../config.ts'


const router = Router()

router.post("/signup", async (req,res) => {
  // Handle signup logic here
  const body = req.body;
  const parsedData = signupSchema.safeParse(body);
  if(parsedData.success) {
        const userexists = await pcl.user.findUnique({ where: { email: parsedData.data?.email } });
        if(userexists){
        res.status(400).json({ error: "User already exists" });
        } else {
        const newUser = await pcl.user.create({ data: parsedData.data });
        //await sendEmail
        res.status(201).json({message:"Please verify your email"});
        }
  } 
  else {
    res.status(400).json({ errors: parsedData.error });
  }


})

router.post("/signin", async (req,res) => {
    const body = req.body;
    const parsedData = loginSchema.safeParse(body);
    if(!parsedData.success){
        res.status(411).json({ errors: "Incorrect Inputs"});
    }
    const user = await pcl.user.findFirst({ where: { email: parsedData.data?.email, password: parsedData.data?.password } });
    if(!user){
        res.status(401).json({ error: "Invalid Email or Password"}); 
    }
    const token = jwt.sign({ userId: user?.id }, JWT_PASSWORD, { expiresIn: "1h" });
    res.status(200).json({ token:token });
})

router.get('/', authMiddleware, async (req,res) => {
    //@ts-ignore
    const id = req.id;
    console.log("ID",id);
    const user = await pcl.user.findUnique({ where: { id:id }, select: { name: true, email: true } });
    if(!user){
        res.status(404).json({ error: "User not found"});
    }
    res.status(200).json({ user });
})

export const userRouter = router;