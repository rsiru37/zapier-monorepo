import { pcl } from "./index.ts";
async function main() {
  console.log("Starting database seed...\n");

  // 1. Create User
  const user = await pcl.user.create({
    data: {
      name: "rajsiruvani",
      email: "rs@gmail.com",
      password: "12345678",
    },
  });
  console.log("✓ User created:", user);

  // 2. Create Available Actions
  const emailAction = await pcl.available_Actions.create({
    data: {
      id:"email",
      name: "email",
      image: "https://via.placeholder.com/50?text=Email",
    },
  });
  console.log("✓ Email action created:", emailAction);

  const solanaAction = await pcl.available_Actions.create({
    data: {
      id:"solana",
      name: "solana",
      image: "https://via.placeholder.com/50?text=Solana",
    },
  });
  console.log("✓ Solana action created:", solanaAction);

  // 3. Create Available Trigger
  const webhookTrigger = await pcl.available_Triggers.create({
    data: {
      trigger_name: "webhook",
      image: "https://via.placeholder.com/50?text=Webhook",
    },
  });
  console.log("✓ Webhook trigger created:", webhookTrigger);

  // 4. Create Trigger instance
  const trigger = await pcl.trigger.create({
    data: {
      trigger_id: webhookTrigger.id,
    },
  });
  console.log("✓ Trigger instance created:", trigger);

  // 5. Create Zap
  const zap = await pcl.zap.create({
    data: {
      trigger_id: trigger.id,
      user_id: user.id,
    },
  });
  console.log("✓ Zap created:", zap);

  // 6. Create Actions for the Zap
  const emailActionInstance = await pcl.action.create({
    data: {
      action_name_id: emailAction.id,
      zap_id: zap.id,
      metadata: {
        value: 1,
      },
      sortingOrder: 1,
    },
  });
  console.log("✓ Email action instance created:", emailActionInstance);

  const solanaActionInstance = await pcl.action.create({
    data: {
      action_name_id: solanaAction.id,
      zap_id: zap.id,
      metadata: {
        value: 5,
      },
      sortingOrder: 2,
    },
  });
  console.log("✓ Solana action instance created:", solanaActionInstance);
}
main();