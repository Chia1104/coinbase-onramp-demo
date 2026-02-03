import { createWebhook } from "workflow";

async function onrampWebhooks(request: Request) {
  "use step";
  // Get raw body (from express.raw middleware)
  const rawBody = Buffer.isBuffer(request.body)
    ? request.body.toString("utf8")
    : JSON.stringify(request.body);

  // Parse JSON from raw body
  const webhookData = Buffer.isBuffer(request.body)
    ? JSON.parse(rawBody)
    : request.body;

  const eventType = webhookData.eventType || webhookData.event;

  // Extract transaction ID (different field names)
  const txId =
    webhookData.transactionId ||
    webhookData.orderId ||
    webhookData.data?.transaction?.id;

  // Handle different webhook events
  switch (eventType) {
    case "onramp.transaction.created":
      console.log("[WEBHOOK] Transaction created:", txId);
      // Transaction initiated - could send "processing" notification
      break;

    case "onramp.transaction.updated":
      console.log("[WEBHOOK] Transaction updated:", txId);
      // Transaction status changed - could track intermediate states
      break;

    case "onramp.transaction.success":
    case "onramp.transaction.completed": {
      // Support both event names
      console.log("[WEBHOOK] Transaction completed:", txId);

      // Extract fields (handle both Apple Pay and Widget formats)
      // Apple Pay: { purchaseAmount: "100.000000", purchaseCurrency: "USDC", destinationNetwork: "base" }
      // Widget: { purchaseAmount: { value: "4.81", currency: "USDC" }, purchaseCurrency: "USDC", purchaseNetwork: "ethereum" }

      const amount =
        typeof webhookData.purchaseAmount === "object"
          ? webhookData.purchaseAmount?.value
          : webhookData.purchaseAmount;

      const currency = webhookData.purchaseCurrency;

      const network =
        webhookData.destinationNetwork || webhookData.purchaseNetwork;

      const partnerUserRef = webhookData.partnerUserRef;

      console.log("[WEBHOOK] User received:", {
        amount,
        currency,
        network,
        address: webhookData.destinationAddress || webhookData.walletAddress,
        partnerUserRef,
      });

      break;
    }

    case "onramp.transaction.failed": {
      console.error(" [WEBHOOK] Transaction failed:", txId);

      // Extract failure fields (handle both formats)
      const failedAmount =
        typeof webhookData.paymentAmount === "object"
          ? webhookData.paymentAmount?.value
          : webhookData.paymentAmount;

      const failedCurrency =
        typeof webhookData.paymentAmount === "object"
          ? webhookData.paymentAmount?.currency
          : webhookData.paymentCurrency;

      const failureReason = webhookData.failureReason || "Unknown error";
      const failedPartnerUserRef = webhookData.partnerUserRef;

      console.warn("[WEBHOOK] Failure details:", {
        amount: failedAmount,
        currency: failedCurrency,
        reason: failureReason,
        partnerUserRef: failedPartnerUserRef,
      });

      break;
    }

    default:
      console.warn("[WEBHOOK] Unknown event type:", eventType);
  }
}

export async function onrampWebhooksWorkflow() {
  "use workflow";

  const webhook = createWebhook();
  const request = await webhook;

  onrampWebhooks(request);
}
