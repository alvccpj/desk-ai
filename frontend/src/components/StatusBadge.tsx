import type { TicketStatus } from '../api/tickets'

const config: Record<TicketStatus, { label: string; className: string }> = {
  open: { label: 'Aberto', className: 'badge bg-blue-100 text-blue-800' },
  in_progress: { label: 'Em andamento', className: 'badge bg-yellow-100 text-yellow-800' },
  waiting: { label: 'Aguardando', className: 'badge bg-purple-100 text-purple-800' },
  resolved: { label: 'Resolvido', className: 'badge bg-green-100 text-green-800' },
  closed: { label: 'Fechado', className: 'badge bg-gray-100 text-gray-600' },
}

export function StatusBadge({ status }: { status: TicketStatus }) {
  const { label, className } = config[status] ?? config.open
  return <span className={className}>{label}</span>
}
