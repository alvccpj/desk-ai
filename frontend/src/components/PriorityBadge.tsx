import type { TicketPriority } from '../api/tickets'

const config: Record<TicketPriority, { label: string; className: string }> = {
  low: { label: 'Baixa', className: 'badge bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300' },
  medium: { label: 'Média', className: 'badge bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-200' },
  high: { label: 'Alta', className: 'badge bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-200' },
  critical: { label: 'Crítica', className: 'badge bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-200' },
}

export function PriorityBadge({ priority }: { priority: TicketPriority }) {
  const { label, className } = config[priority] ?? config.medium
  return <span className={className}>{label}</span>
}
