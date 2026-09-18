import { pcl } from '@repo/db'
import { kafka } from "@repo/kafka"

const TOPIC_NAME = 'zap-events'
const producer = kafka.producer()

async function main() {
    await producer.connect()

    while(1){
        const pendingrows = await pcl.zap_run_outbox.findMany({take: 10}); // This will list 10 rows from the Outbox Table
        for (const row of pendingrows) {
            producer.send({
                        topic: TOPIC_NAME,
                        messages: pendingrows.map(r => ({
                            value: JSON.stringify({ zap_run_id: r?.zap_run_id, stage: 1 }) // Trigger will be stage 0 to keep track till when the last action is executed
                                })
                            )
            })
        } // After pushing it to the Kafka topic, we will delete the processed rows from the DB
        await pcl.zap_run_outbox.deleteMany({ where: { id: { in: pendingrows.map(row => row.id) } } })


    }

}
main();