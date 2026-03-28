import type { TicketStatus } from '../api/tickets'

const config: Record<TicketStatus, { label: string; className: string }> = {
  open: {
    label: 'Aberto',
    className: 'badge bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-200',
  },
  in_progress: {
    label: 'Em andamento',
    className: 'badge bg-yellow-100 text-yellow-800 dark:bg-yellow-950/50 dark:text-yellow-200',
  },
  waiting: {
    label: 'Aguardando',
    className: 'badge bg-purple-100 text-purple-800 dark:bg-purple-950/50 dark:text-purple-200',
  },
  resolved: {
    label: 'Resolvido',
    className: 'badge bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-200',
  },
  closed: {
    label: 'Fechado',
    className: 'badge bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
  },
}

export function StatusBadge({ status }: { status: TicketStatus }) {
  const { label, className } = config[status] ?? config.open
  return <span className={className}>{label}</span>
}
