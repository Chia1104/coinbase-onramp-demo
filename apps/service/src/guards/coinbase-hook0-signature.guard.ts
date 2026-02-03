import crypto from "node:crypto";

import { createMiddleware } from "hono/factory";

const MAX_AGE = 300;
const HEADER_NAME = "X-Hook0-Signature";

interface SignatureComponents {
  timestamp: string;
  headerNames: string[];
  signature: string;
}

/**
 * Parse the X-Hook0-Signature header
 * Format: "t=1234567890,h=header1:header2,v1=signature_hash"
 */
function parseSignatureHeader(
  signatureHeader: string
): SignatureComponents | null {
  try {
    const parts = signatureHeader.split(",");
    const components: Partial<SignatureComponents> = {
      headerNames: [],
    };

    for (const part of parts) {
      const [key, value] = part.split("=");
      if (!value) continue; // Skip if value is undefined

      if (key === "t") {
        components.timestamp = value;
      } else if (key === "h") {
        // Header names are space-separated, not colon-separated
        components.headerNames = value.split(" ");
      } else if (key === "v1") {
        // Prefer v1 signature (newer format with period delimiters)
        components.signature = value;
      } else if (key === "v0") {
        // Use v0 only if v1 wasn't found (older format)
        if (!components.signature) {
          components.signature = value;
        }
      }
    }

    if (!components.timestamp || !components.signature) {
      return null;
    }

    return components as SignatureComponents;
  } catch (error) {
    console.error("[WEBHOOK] Error parsing signature header:", error);
    return null;
  }
}

/**
 * Construct the signed payload string
 * Format: timestamp.headerNames.headerValues.rawBody
 * Example: "1234567890.content-type x-event-id.application/json abc123.{\"data\":\"value\"}"
 */
async function constructSignedPayload(
  timestamp: string,
  headerNames: string[],
  request: Request
): Promise<string> {
  // 1. Timestamp
  const parts = [timestamp];

  // 2. Header names (space-separated)
  parts.push(headerNames.join(" "));

  // 3. Header values (period-separated)
  const headerValues: string[] = [];
  for (const headerName of headerNames) {
    const headerValue = request.headers.get(headerName.toLowerCase());
    if (headerValue) {
      // Handle array or string
      const value = Array.isArray(headerValue) ? headerValue[0] : headerValue;
      // Only push if value is a string (not undefined)
      if (typeof value === "string") {
        headerValues.push(value);
      }
    }
  }
  parts.push(headerValues.join("."));

  // 4. Raw body
  parts.push(
    Buffer.isBuffer(request.body)
      ? request.body.toString("utf8")
      : JSON.stringify(request.body)
  );

  // Join all parts with periods
  const payload = parts.join(".");

  return payload;
}

/**
 * Verify webhook signature
 *
 * @param signatureHeader - X-Hook0-Signature header value
 * @param headers - All request headers
 * @param rawBody - Raw request body string
 * @param secret - Webhook signing secret from Coinbase
 * @param maxAge - Maximum age of webhook in seconds (default: 300 = 5 minutes)
 * @returns true if signature is valid, false otherwise
 */
async function verifyWebhookSignature(
  signatureHeader: string,
  request: Request,
  secret: string,
  maxAge = MAX_AGE
): Promise<boolean> {
  try {
    // Parse signature header
    const components = parseSignatureHeader(signatureHeader);
    if (!components) {
      console.error("[WEBHOOK] Invalid signature header format");
      return false;
    }

    // Check timestamp to prevent replay attacks
    const webhookTimestamp = parseInt(components.timestamp, 10);
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const age = currentTimestamp - webhookTimestamp;

    if (age > maxAge) {
      console.error("[WEBHOOK] Webhook too old:", {
        age,
        maxAge,
        webhookTime: new Date(webhookTimestamp * 1000).toISOString(),
        currentTime: new Date(currentTimestamp * 1000).toISOString(),
      });
      return false;
    }

    if (age < -60) {
      console.error("[WEBHOOK] Webhook timestamp is in the future");
      return false;
    }

    // Construct the signed payload
    const signedPayload = constructSignedPayload(
      components.timestamp,
      components.headerNames,
      request
    );

    // Compute HMAC-SHA256 signature
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(await signedPayload)
      .digest("hex");

    // Timing-safe comparison to prevent timing attacks
    const isValid = crypto.timingSafeEqual(
      Buffer.from(components.signature, "hex"),
      Buffer.from(expectedSignature, "hex")
    );

    if (!isValid) {
      console.error("[WEBHOOK] Signature mismatch", {
        expected: expectedSignature,
        received: components.signature,
      });
    }

    return isValid;
  } catch (error) {
    console.error("[WEBHOOK] Signature verification error:", error);
    return false;
  }
}

export const coinbaseHook0SignatureGuard = createMiddleware<HonoContext>(
  async (c, next) => {
    const signatureHeader = c.req.header(HEADER_NAME);
    if (!signatureHeader) {
      return c.json({ error: "Missing signature header" }, 400);
    }

    const webhooksSecret = await c.var.kv.get("onramp-webhooks-secret");

    if (!webhooksSecret) {
      return c.json({ error: "Missing webhooks secret" }, 400);
    }

    const isValid = await verifyWebhookSignature(
      signatureHeader,
      c.req.raw.clone(),
      webhooksSecret
    );

    if (!isValid) {
      return c.json({ error: "Invalid signature" }, 400);
    }

    return next();
  }
);
