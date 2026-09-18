import { kafka } from "@repo/kafka";
import { pcl } from "@repo/db"
import { sendEmail } from "./email"
import { sendSolana } from "./solana"
import { parse } from "./data_parser";
import type { JsonObject } from "@prisma/client/runtime/library";

const TOPIC_NAME = 'zap-events'
const producer = kafka.producer();
await producer.connect();

const consumer = kafka.consumer({ groupId: 'main-worker-2' });
await consumer.connect();

await consumer.subscribe({ topic: TOPIC_NAME, fromBeginning: true })
await consumer.run({
    eachMessage: async ({ partition, message }) => { // FROM BEGINNING

        if(!message?.value){
            return
        }
        const {zap_run_id, stage} = JSON.parse(message?.value?.toString());
        console.log("Zap_run_id", "stage", zap_run_id, stage);
        const zap_run_object = await pcl.zap_run.findUnique({ 
                where: { id:zap_run_id}
            });
        const actions = await pcl.action.findMany({ where: {zap_id:zap_run_object?.zap_id}});
        const current_action = await pcl.action.findFirst(
            {
                where: {zap_id: zap_run_object?.zap_id, sortingOrder:stage}
            }
        );

        if(!current_action){
            return;
        }
        if(current_action.action_name_id === "email"){
            if(!current_action.metadata){
                return;
            }
            const body = parse((current_action.metadata as JsonObject)?.body as string, zap_run_object?.metadata);
            const to = parse((current_action.metadata as JsonObject)?.email as string, zap_run_object?.metadata);
            const subject = "Regarding your bounty Disbursal";
            console.log(`Sending Email to ${to} and body is ${body} `);
            await sendEmail({to:to, subject:subject, text:body});
        }
        if(current_action.action_name_id === "solana"){
            const amount = parse((current_action.metadata as JsonObject)?.amount as string, zap_run_object?.metadata);
            const address = parse((current_action.metadata as JsonObject)?.address as string, zap_run_object?.metadata);
            console.log(`Sending Solana, ${address} and the Amount is ${amount}`);
            await sendSolana(address, Number(amount));
        }
        
        
        const last_stage = actions?.length;
        if(stage!==last_stage){
            producer.send({ // We will be sending all the next actions one by one to the kafka to this same file, we cannot execute them all at once, hence we are using kafka
                topic: TOPIC_NAME,
                messages: [{
                    value: JSON.stringify({ zap_run_id: zap_run_id, stage: stage+1 })
                }]
            })
        }
        await consumer.commitOffsets([{
            topic: TOPIC_NAME,
            partition: partition,
            offset: (parseInt(message.offset) + 1).toString() // 5
          }])
        }}
    );
