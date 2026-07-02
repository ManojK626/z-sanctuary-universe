# Payment Abstraction Design

**Status:** Interface design only · **runtime HOLD**  
**Gate:** AMK + commercial posture — not Learning phase

## Philosophy

Payment providers are **replaceable adapters**. VILE apps never embed Stripe/MobileMoney keys directly.

## Package

`packages/zuno-payments` — **HOLD** until revenue phase chartered.

## Adapter interfaces (conceptual)

```typescript
// Illustrative — implement in Phase 3+ with AMK gate
interface PaymentIntent {
  id: string;
  amountMinor: number;
  currency: string;
  region: 'MU' | 'RE' | 'MG' | string;
  metadata: Record<string, string>;
}

interface PaymentProviderAdapter {
  createIntent(intent: PaymentIntent): Promise<{ clientSecret?: string; redirectUrl?: string }>;
  capture(intentId: string): Promise<PaymentResult>;
  refund(intentId: string, amountMinor?: number): Promise<PaymentResult>;
}
```

## Supported categories (future)

| Category | Examples |
| -------- | -------- |
| Global cards | Stripe-class adapters |
| Regional mobile money | MCB Juice, Orange Money, MVola — region-specific plugins |
| Escrow | Marketplace hold — **charter required** |
| Split settlement | Host + platform + conservation — **legal review** |

## Explicitly not in scope (now)

- Live Stripe keys  
- VAT calculation engines  
- Company registration workflows  
- Production webhooks  

## Related

- [commercial-readiness-audit](../commercial-readiness-audit/README.md) — Questra leads income discovery, not VILE payments yet  
- [ZILWA_FINANCIAL_LEDGER_MOCK_SPEC.md](../zilwa-living-experiences/ZILWA_FINANCIAL_LEDGER_MOCK_SPEC.md) — illustrative only  
