import type { TicketPriority } from '../api/tickets'

const config: Record<TicketPriority, { label: string; className: string }> = {
  low: { label: 'Baixa', className: 'badge bg-gray-100 text-gray-600' },
  medium: { label: 'Média', className: 'badge bg-blue-100 text-blue-700' },
  high: { label: 'Alta', className: 'badge bg-orange-100 text-orange-700' },
  critical: { label: 'Crítica', className: 'badge bg-red-100 text-red-700' },
}

export function PriorityBadge({ priority }: { priority: TicketPriority }) {
  const { label, className } = config[priority] ?? config.medium
  return <span className={className}>{label}</span>
}
