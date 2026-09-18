import Router from 'express'
import { authMiddleware } from '../middleware.ts'
import { signupSchema, loginSchema } from '@repo/types'
import { pcl } from '@repo/db'
import jwt from "jsonwebtoken"
import { JWT_PASSWORD } from '../config.ts'

const router = Router()

router.post("/available_actions", async (req, res) => {
    //@ts-ignore
  const { available_action_name } = req.body;
  const available_actions = await pcl.available_Actions.create({
    data: {
      name: available_action_name
    }
  });
  res.status(200).json(available_actions);
});

router.get("/available_actions", async (req, res) => {
  const available_actions = await pcl.available_Actions.findMany();
  res.status(200).json(available_actions);
});

export const actionRouter = router;
