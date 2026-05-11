import React from 'react';
import HighlightText from './HighlightText.jsx';
import StructureFlowLine from './StructureFlowLine.jsx';

/** Sample local content only — no AI parsing, no network. */
export const SAMPLE_VISUAL_FLOW = {
  subject: 'Local workstation rhythm',
  userRequest: 'How do I stay grounded while building features?',
  keyIdeas: ['Verify locally first', 'Use Comfort bar for eyes and motion', 'Keep scope within chartered phases'],
  guardianNote: 'Pause and review doctrine if a step would cross bridge or runtime gates.',
  suggestedNext: 'Open Visual Structure View after any local Q&A to lay out meaning before acting.',
  relatedRoute: 'learning.cards.local',
};

function FlowCard({ labelTone, label, children }) {
  return (
    <div className="zq-structure-card">
      <div style={{ marginBottom: '0.25rem' }}>
        <HighlightText tone={labelTone} variant="pill">
          {label}
        </HighlightText>
      </div>
      <div style={{ fontSize: '0.88rem', lineHeight: 1.45, color: 'var(--zq-text)' }}>{children}</div>
    </div>
  );
}

export default function VisualStructurePanel({ flow = SAMPLE_VISUAL_FLOW }) {
  const lineTone = 'var(--zq-structure-line)';

  return (
    <div className="zq-visual-structure-flow">
      <p className="zq-structure-disclaimer" role="note">
        <strong>Visual Structure View</strong> is <strong>local UI only</strong> in this phase. It does not call external
        AI or Z-Sanctuary services. Content shown is sample / manual placement only.
      </p>

      <FlowCard labelTone="violet" label="Subject">
        {flow.subject}
      </FlowCard>
      <StructureFlowLine vertical tone={lineTone} />

      <FlowCard labelTone="sky" label="User request">
        {flow.userRequest}
      </FlowCard>
      <StructureFlowLine vertical tone={lineTone} />

      <FlowCard labelTone="mint" label="Key ideas">
        <ul style={{ margin: 0, paddingLeft: '1.1rem' }}>
          {flow.keyIdeas.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </FlowCard>
      <StructureFlowLine vertical tone={lineTone} />

      <FlowCard labelTone="leaf" label="Guardian check">
        {flow.guardianNote}
      </FlowCard>
      <StructureFlowLine vertical tone={lineTone} />

      <FlowCard labelTone="amber" label="Suggested action">
        {flow.suggestedNext}
      </FlowCard>
      <StructureFlowLine vertical tone={lineTone} />

      <FlowCard labelTone="lavender" label="Related route / panel">
        <HighlightText tone="aqua" variant="emphasis">
          {flow.relatedRoute}
        </HighlightText>{' '}
        <span style={{ color: 'var(--zq-text-muted)', fontSize: '0.82rem' }}>(metadata — not connected)</span>
      </FlowCard>
    </div>
  );
}
