import { CircleAlert, CircleCheck } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { Decision } from '@/models/entities/message'

function confidenceTone(confidence: number) {
  if (confidence >= 0.75) return { bar: 'bg-success', text: 'text-success-text', label: 'alta' }
  if (confidence >= 0.5) return { bar: 'bg-warning', text: 'text-warning-text', label: 'média' }
  return { bar: 'bg-danger', text: 'text-danger-text', label: 'baixa' }
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-0.5 sm:grid-cols-[96px_1fr] sm:gap-3">
      <dt className="text-ink-3">{label}</dt>
      <dd className="min-w-0 text-ink">{children}</dd>
    </div>
  )
}

/**
 * Detalhe de uma decisão do agent: o que entendeu, o que fez, com que segurança e por quê,
 * e quais ferramentas usou. É o principal mecanismo de transparência do produto.
 */
export function DecisionDetails({ decision, className }: { decision: Decision; className?: string }) {
  const tone = decision.confidence !== null ? confidenceTone(decision.confidence) : null

  return (
    <div className={cn('w-[600px] max-w-full animate-msg-in rounded-xl border border-rule bg-desk p-3.5 text-[13px]', className)}>
      <dl className="flex flex-col gap-2">
        <Row label="Entendi que">{decision.intent}</Row>
        <Row label="Ação">{decision.action}</Row>
        <Row label="Confiança">
          {tone && decision.confidence !== null ? (
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-24 overflow-hidden rounded-full bg-rule">
                <span className={cn('block h-full rounded-full', tone.bar)} style={{ width: `${decision.confidence * 100}%` }} />
              </span>
              <span className={cn('font-medium', tone.text)}>
                {Math.round(decision.confidence * 100)}% · {tone.label}
              </span>
            </span>
          ) : (
            <span className="text-ink-3">não informada</span>
          )}
        </Row>
        <Row label="Por quê">{decision.reasoning}</Row>
        {decision.toolCalls.length > 0 && (
          <Row label="Ferramentas">
            <ol className="flex flex-col gap-1">
              {decision.toolCalls.map((call, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  {call.ok ? (
                    <CircleCheck size={13} className="mt-0.5 flex-none text-success-text" />
                  ) : (
                    <CircleAlert size={13} className="mt-0.5 flex-none text-danger-text" />
                  )}
                  <span className="min-w-0">
                    <code className="text-[12px] text-ink-2">{call.tool}</code>
                    <span className="text-ink-3"> · {call.durationMs} ms · {call.summary}</span>
                  </span>
                </li>
              ))}
            </ol>
          </Row>
        )}
      </dl>
      {(decision.model || decision.latencyMs) && (
        <p className="mt-2.5 border-t border-rule pt-2 text-[12px] text-ink-3">
          {[
            decision.model,
            decision.latencyMs !== null && `${(decision.latencyMs / 1000).toFixed(1)} s`,
            decision.inputTokens !== null && `${decision.inputTokens + (decision.outputTokens ?? 0)} tokens`,
          ]
            .filter(Boolean)
            .join(' · ')}
        </p>
      )}
    </div>
  )
}
