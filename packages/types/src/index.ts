import {z} from "zod";

const signupSchema = z.object({
    name: z.string().min(2).max(100),
    email: z.email(),
    password: z.string().min(8).max(100)
});

const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(8).max(100)
});

const ZapCreateSchema = z.object({
    available_triggerid:z.string(),
    triggermetadata:z.any(),
    actions:z.array(z.object({ available_action_name_id:z.string(), action_metadata:z.any() }))
})

export {signupSchema, loginSchema, ZapCreateSchema}