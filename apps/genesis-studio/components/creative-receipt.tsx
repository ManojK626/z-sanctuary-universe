'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface CreativeReceiptProps {
  module: string;
  lastAction: string;
}

export function CreativeReceipt({ module, lastAction }: CreativeReceiptProps) {
  return (
    <Card className="border-gold/30 bg-gradient-to-br from-card/90 to-violet/5">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gold">Creative Receipt</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-xs text-muted-foreground">
        <div className="flex justify-between gap-2">
          <span>Module</span>
          <span className="text-foreground">{module}</span>
        </div>
        <div className="flex justify-between gap-2">
          <span>Last action</span>
          <span className="text-right text-foreground">{lastAction}</span>
        </div>
        <div className="flex justify-between gap-2">
          <span>Provider</span>
          <span className="text-amber-200/90">Stub only</span>
        </div>
        <div className="flex justify-between gap-2">
          <span>DRP status</span>
          <span className="text-violet-300">Safe placeholder</span>
        </div>
      </CardContent>
    </Card>
  );
}
