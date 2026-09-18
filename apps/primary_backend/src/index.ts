import express  from "express";
import { userRouter } from "./router/user.ts";
import { zapRouter } from "./router/zap.ts";
import { actionRouter } from "./router/action.ts";
import { triggerRouter } from "./router/trigger.ts";
import cors from 'cors'


const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/v1/user", userRouter);
app.use("/api/v1/zap", zapRouter);
app.use("/api/v1/action", actionRouter);
app.use("/api/v1/trigger", triggerRouter);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
})
