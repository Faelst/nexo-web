import { RequireRole } from '@/components/auth/RequireRole'
import { AgentConsoleView } from '@/views/AgentConsoleView'

export const metadata = { title: 'Conversas · Nexo Assist' }

export default function AtendentePage() {
  return (
    <RequireRole role="ANALYST">
      <AgentConsoleView />
    </RequireRole>
  )
}
