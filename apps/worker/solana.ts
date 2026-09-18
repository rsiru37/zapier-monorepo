import {Connection,PublicKey,Transaction,SystemProgram,sendAndConfirmTransaction,Keypair} from "@solana/web3.js";
import bs58 from 'bs58';

async function sendSolana(toAddress: string,amount: number): Promise<string> {
  try {
    // 1. Connect to Solana network
    const connection = new Connection("https://api.devnet.solana.com","confirmed");

    // 2. Load your wallet (private key)
    const secretKey = process.env.SOLANA_PRIVATE_KEY; // Store as base58 string
    const keypair = Keypair.fromSecretKey(bs58.decode(secretKey!));

    // 3. Create recipient public key
    const recipient = new PublicKey(toAddress);
    // 4. Convert SOL to lamports (1 SOL = 1 billion lamports)
    const lamports = amount * 1_000_000_000;

    // 5. Create transaction
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: keypair.publicKey,
        toPubkey: recipient,
        lamports: lamports,
      })
    );

    // 6. Send and confirm transaction
    const signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [keypair]
    );

    console.log("Transaction successful!");
    console.log("Signature:", signature);
    return signature;
  } catch (error) {
    console.error("Error sending Solana:", error);
    throw error;
  }
}

export { sendSolana }