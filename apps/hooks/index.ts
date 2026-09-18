import express from "express"
import { pcl }  from "@repo/db"
const app = express()
app.use(express.json())

app.post('/hooks/catch/:userid/:zapid', async (req, res) => {
      //@ts-ignore
    const { userid, zapid } = req.params;
    console.log("REQ.PARAMS", userid, zapid,req.params, req.body);
    const {metadata} = req.body;
    await pcl.$transaction(async (tx) => 
        {
            const zaprun = await tx.zap_run.create({ data: { zap_id: zapid, metadata: metadata }});
            console.log("ZAP_RUN", zaprun);
            const zap_run_out = await tx.zap_run_outbox.create({ data: { zap_run_id: zaprun.id }});
            console.log("ZAP RUN OUT", zap_run_out);
        }
    );
    res.json({"status": "success"});

});


app.listen(3002, () => {
    console.log("Server is running on port 3002")
})

// The Reason of having two tables(zap run & zap run outbox) is because lets say we get data fed inside zap run and node process dies, Kafka would never pick up that process
// So we used a tx to ensure data gets stored in both the dbs or dont get saved at all and kafka would pickup row by row from the outbox db.
// This is called Outbox Pattern for Microservices