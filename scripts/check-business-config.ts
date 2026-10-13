// scripts/check-business-config.ts
/**
 * Build-time check: fail the deployment when required business configuration is
 * absent, instead of discovering it when a customer reaches the payment step.
 *
 * Set ALLOW_MISSING_BUSINESS_CONFIG=1 to build without the values (local
 * experiments only).
 */
import { parseBusinessConfig } from "../lib/business-config";

const allowMissing = process.env.ALLOW_MISSING_BUSINESS_CONFIG === "1";

try {
  const config = parseBusinessConfig(process.env, { requireAll: !allowMissing });

  if (config.paymentDestinations.length === 0) {
    console.warn(
      "[business-config] No payment destination is configured; the checkout payment step will refuse the order.",
    );
  } else {
    console.log(
      `[business-config] ${config.paymentDestinations.length} payment destination(s), contact ${
        config.whatsappNumber || "(unset)"
      }`,
    );
  }
} catch (error) {
  console.error(
    `[business-config] ${error instanceof Error ? error.message : String(error)}`,
  );
  console.error(
    "[business-config] Set the missing variables (see .env.example) or set ALLOW_MISSING_BUSINESS_CONFIG=1 to skip this check.",
  );
  process.exit(1);
}
