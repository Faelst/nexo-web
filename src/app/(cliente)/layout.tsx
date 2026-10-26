import { RequireRole } from '@/components/auth/RequireRole'
import { ClientShell } from '@/components/layout/ClientShell'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireRole role="EMPLOYEE">
      <ClientShell>{children}</ClientShell>
    </RequireRole>
  )
}
