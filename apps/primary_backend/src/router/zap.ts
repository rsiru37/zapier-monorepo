import Router from 'express'
import { authMiddleware } from '../middleware.ts'
import { ZapCreateSchema } from '@repo/types'
import {pcl} from '@repo/db'

const router = Router()

router.post("/",authMiddleware, async(req,res) => {
  //@ts-ignore
  const user_id:string = req.id;
  const body = req.body;
  console.log("BODY", body.actions);
  const parsedData = ZapCreateSchema.safeParse(body);
  if(!parsedData.success){
    console.log("Error", parsedData.error);
      res.status(411).json({ errors: parsedData.error });
      return; // Stop further execution
  }
  console.log("PARSED_DATA", parsedData.data);
const zap = await pcl.zap.create({
data: {
    user: { connect: { id: parseInt(user_id)}},
    Action: {
      create: parsedData.data?.actions.map((action, index) => ({
        Available_Actions: {
          connect: { id: action.available_action_name_id}
        },
        metadata: action.action_metadata,
        sortingOrder: index
      }
  ))
},
Trigger: {
    create: {
      trigger_id: parsedData.data?.available_triggerid // Here trigger id is the available Trigger ID
    }
  },
}
});
res.status(200).json({zap:zap, message:"Zap Created Successfully"});
})

router.get("/",authMiddleware, async(req,res) => {
  //@ts-ignore
  const user_id = req.id; // Fetching the User id from the Token
  console.log("UID", user_id);
  const zaps = await pcl.zap.findMany({
    where: {
      user_id: parseInt(user_id)
    },
    include: {
      Action: {
        include: {
          Available_Actions: true
        }
            },
      Trigger: {
        include: {
          Available_Triggers: true
        }
      }
      }
  });
  res.status(200).json({zaps: zaps});
})

router.get("/login", (req, res) => {
  // Handle login logic here
})

router.get('/:zapId', authMiddleware, async (req,res) => {
    //@ts-ignore
    const user_id = req.id;
    const {zapId} = req.params;
    if(zapId){
     const zap = await pcl.zap.findFirst({
     where:{
      id: zapId as string,
      user_id: user_id
     },
     include:{
      Action: {
        include: {
          Available_Actions: true
        }
      },
      Trigger: {
        include: {
          Available_Triggers: true
        }
      }
     } 
    })
    res.status(200).json(zap); 
    }
})



export const zapRouter = router;