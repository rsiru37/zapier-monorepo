import { sendEmail } from "./index.ts";

async function main() {
  console.log("Sending a test email using Bun...");
  
  await sendEmail({
    to: "rajindustries6202@gmail.com",
    subject: "Hello from Bun + TypeScript!",
    text: "This is a plain text email sent using Bun.",
    html: "<h1>Hello!</h1><p>This is a <b>HTML</b> email sent using Bun.</p>",
  });
}

main();