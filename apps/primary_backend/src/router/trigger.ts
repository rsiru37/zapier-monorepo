import Router from 'express'
import { authMiddleware } from '../middleware.ts'
import { signupSchema, loginSchema } from '@repo/types'
import { pcl } from '@repo/db'
import jwt from "jsonwebtoken"
import { JWT_PASSWORD } from '../config.ts'

const router = Router()

router.post("/available_triggers", async (req, res) => {
    //@ts-ignore
  const { available_trigger_name } = req.body;
  const available_triggers = await pcl.available_Triggers.create({
    data: {
      trigger_name: available_trigger_name
    }
  });
  res.status(200).json(available_triggers);
});

router.get("/available_triggers", async (req, res) => {
  const available_triggers = await pcl.available_Triggers.findMany();
  res.status(200).json(available_triggers);
});

export const triggerRouter = router;