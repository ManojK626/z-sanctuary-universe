'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { PersistenceReceipt } from '@/lib/projects';

interface PersistenceReceiptCardProps {
  receipt: PersistenceReceipt;
}

export function PersistenceReceiptCard({ receipt }: PersistenceReceiptCardProps) {
  return (
    <Card className="border-emerald-500/30 bg-gradient-to-br from-card/90 to-emerald-950/10">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-emerald-300/90">
          Persistence Receipt
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-xs text-muted-foreground">
        <Row label="Storage" value={receipt.storageLabel} />
        <Row
          label="Save status"
          value={
            receipt.saveStatus === 'saved'
              ? 'Saved'
              : receipt.saveStatus === 'error'
                ? 'Error'
                : 'Not saved yet'
          }
        />
        <Row
          label="Last saved"
          value={receipt.lastSavedAt ? new Date(receipt.lastSavedAt).toLocaleString() : '—'}
        />
        <Row label="Project id" value={receipt.projectId ?? '—'} />
        <Row label="Provider" value={receipt.providerStatus} />
        <Row label="Human review" value={receipt.humanReviewRequired ? 'Required' : '—'} />
        {receipt.message && (
          <p className="pt-1 text-[11px] leading-snug text-amber-200/80">{receipt.message}</p>
        )}
      </CardContent>
    </Card>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-2">
      <span>{label}</span>
      <span className="max-w-[58%] text-right text-foreground">{value}</span>
    </div>
  );
}
