// lib/business-config.ts
/**
 * Single source of business configuration for customer-facing surfaces.
 *
 * Values come from environment variables and are parsed once per process.
 * The module never invents a fallback value: a missing destination means the
 * payment method is not offered, and a missing required value in production
 * fails loudly (see design.md in openspec/changes/fix-customer-facing-placeholders).
 */

export type PaymentMethodId = "TRANSFER" | "EWALLET" | "QRIS" | "COD";

/** One payable destination: a bank account, a wallet number, or similar. */
export interface PaymentAccount {
  /** What the account is, e.g. "BCA" or "GoPay". */
  label: string;
  /** The account number or phone number customers send money to. */
  value: string;
  /** Account holder name as it must appear to the customer. */
  holder?: string;
}

export interface PaymentDestination {
  method: PaymentMethodId;
  name: string;
  description: string;
  badge?: string | null;
  accounts: PaymentAccount[];
  /** Local path under /public for the QR image, when the method uses one. */
  qrImageUrl?: string | null;
  /** Free-form instruction shown for methods without an account, e.g. COD. */
  note?: string | null;
}

export interface BusinessConfig {
  /** WhatsApp number customers send payment proof to, digits only with country code. */
  whatsappNumber: string;
  paymentDestinations: PaymentDestination[];
}

const DESTINATIONS_VAR = "PAYMENT_DESTINATIONS";
const WHATSAPP_VAR = "BUSINESS_WHATSAPP_NUMBER";

type RawEnv = Record<string, string | undefined>;

function isPaymentMethodId(value: unknown): value is PaymentMethodId {
  return (
    value === "TRANSFER" ||
    value === "EWALLET" ||
    value === "QRIS" ||
    value === "COD"
  );
}

function parseAccounts(value: unknown): PaymentAccount[] {
  if (!Array.isArray(value)) return [];

  const accounts: PaymentAccount[] = [];

  for (const entry of value) {
    if (typeof entry !== "object" || entry === null) continue;

    const record = entry as Record<string, unknown>;
    const label = typeof record.label === "string" ? record.label.trim() : "";
    const accountValue =
      typeof record.value === "string" ? record.value.trim() : "";
    if (!label || !accountValue) continue;

    const account: PaymentAccount = { label, value: accountValue };
    const holder =
      typeof record.holder === "string" ? record.holder.trim() : "";
    if (holder) account.holder = holder;

    accounts.push(account);
  }

  return accounts;
}

/** A destination is configured when it can tell the customer where to pay. */
function isConfigured(destination: PaymentDestination): boolean {
  return (
    destination.accounts.length > 0 ||
    Boolean(destination.qrImageUrl) ||
    Boolean(destination.note)
  );
}

/**
 * Parse business configuration from raw environment values.
 *
 * @param raw environment values to read
 * @param options requireAll - throw naming every missing variable instead of
 *   continuing with what is present. Used by the build-time check and by
 *   production requests; development keeps running so the UI can show its
 *   "not configured" state.
 */
export function parseBusinessConfig(
  raw: RawEnv,
  options: { requireAll?: boolean } = {},
): BusinessConfig {
  const missing: string[] = [];

  const whatsappNumber = (raw[WHATSAPP_VAR] ?? "").trim();
  if (!whatsappNumber) missing.push(WHATSAPP_VAR);

  const destinationsRaw = (raw[DESTINATIONS_VAR] ?? "").trim();
  let parsedDestinations: unknown = [];
  if (!destinationsRaw) {
    missing.push(DESTINATIONS_VAR);
  } else {
    try {
      parsedDestinations = JSON.parse(destinationsRaw);
    } catch {
      throw new Error(
        `${DESTINATIONS_VAR} is not valid JSON. Expected an array of payment destinations.`,
      );
    }
    if (!Array.isArray(parsedDestinations)) {
      throw new Error(
        `${DESTINATIONS_VAR} must be a JSON array of payment destinations.`,
      );
    }
  }

  if (options.requireAll && missing.length > 0) {
    throw new Error(
      `Missing required business configuration: ${missing.join(", ")}`,
    );
  }

  const paymentDestinations = (parsedDestinations as unknown[])
    .map((entry) => {
      if (typeof entry !== "object" || entry === null) return null;
      const record = entry as Record<string, unknown>;

      if (!isPaymentMethodId(record.method)) {
        throw new Error(
          `${DESTINATIONS_VAR} contains an entry with an unknown method: ${String(
            record.method,
          )}. Allowed: TRANSFER, EWALLET, QRIS, COD.`,
        );
      }

      const destination: PaymentDestination = {
        method: record.method,
        name: typeof record.name === "string" ? record.name : record.method,
        description:
          typeof record.description === "string" ? record.description : "",
        badge: typeof record.badge === "string" ? record.badge : null,
        accounts: parseAccounts(record.accounts),
        qrImageUrl:
          typeof record.qrImageUrl === "string" ? record.qrImageUrl : null,
        note: typeof record.note === "string" ? record.note : null,
      };

      return destination;
    })
    .filter((destination): destination is PaymentDestination =>
      Boolean(destination),
    )
    .filter(isConfigured);

  return { whatsappNumber, paymentDestinations };
}

let cached: BusinessConfig | undefined;

/**
 * Business configuration for the current process, parsed on first use.
 * Throws in production when a required value is absent, so a misconfigured
 * deployment fails at the request instead of showing invented details.
 */
export function getBusinessConfig(): BusinessConfig {
  cached ??= parseBusinessConfig(
    {
      PAYMENT_DESTINATIONS: process.env[ DESTINATIONS_VAR],
      BUSINESS_WHATSAPP_NUMBER: process.env[WHATSAPP_VAR],
    },
    { requireAll: process.env.NODE_ENV === "production" },
  );

  return cached;
}
