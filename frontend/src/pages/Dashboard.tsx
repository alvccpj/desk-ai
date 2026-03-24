import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Ticket, CheckCircle, Clock, AlertTriangle, TrendingUp, PlusCircle } from 'lucide-react'
import { ticketsApi } from '../api/tickets'
import { useAuth } from '../contexts/AuthContext'
import { StatusBadge } from '../components/StatusBadge'
import { PriorityBadge } from '../components/PriorityBadge'
import { Spinner } from '../components/Spinner'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string
  value: number
  icon: React.ReactNode
  color: string
}) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  )
}

export function Dashboard() {
  const { user } = useAuth()

  const { data: openTickets, isLoading: l1 } = useQuery({
    queryKey: ['tickets', 'open'],
    queryFn: () => ticketsApi.listTickets({ status: 'open' }),
  })
  const { data: inProgressTickets } = useQuery({
    queryKey: ['tickets', 'in_progress'],
    queryFn: () => ticketsApi.listTickets({ status: 'in_progress' }),
  })
  const { data: resolvedTickets } = useQuery({
    queryKey: ['tickets', 'resolved'],
    queryFn: () => ticketsApi.listTickets({ status: 'resolved' }),
  })
  const { data: criticalTickets } = useQuery({
    queryKey: ['tickets', 'critical'],
    queryFn: () => ticketsApi.listTickets({ priority: 'critical' }),
  })
  const { data: recentTickets, isLoading: l2 } = useQuery({
    queryKey: ['tickets', 'recent'],
    queryFn: () => ticketsApi.listTickets({ page: 1 }),
  })

  if (l1 || l2) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner className="w-8 h-8 text-primary-600" />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Olá, {user?.name.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Aqui está um resumo dos seus tickets
          </p>
        </div>
        <Link to="/tickets/new" className="btn-primary">
          <PlusCircle size={16} />
          Novo ticket
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Tickets abertos"
          value={openTickets?.data.count ?? 0}
          icon={<Ticket size={22} className="text-blue-600" />}
          color="bg-blue-50"
        />
        <StatCard
          label="Em andamento"
          value={inProgressTickets?.data.count ?? 0}
          icon={<Clock size={22} className="text-yellow-600" />}
          color="bg-yellow-50"
        />
        <StatCard
          label="Resolvidos"
          value={resolvedTickets?.data.count ?? 0}
          icon={<CheckCircle size={22} className="text-green-600" />}
          color="bg-green-50"
        />
        <StatCard
          label="Críticos"
          value={criticalTickets?.data.count ?? 0}
          icon={<AlertTriangle size={22} className="text-red-600" />}
          color="bg-red-50"
        />
      </div>

      <div className="card">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <TrendingUp size={18} className="text-primary-600" />
            Tickets recentes
          </h2>
          <Link to="/tickets" className="text-sm text-primary-600 hover:underline font-medium">
            Ver todos
          </Link>
        </div>
        <div className="divide-y divide-gray-100">
          {recentTickets?.data.results.slice(0, 8).map((ticket) => (
            <Link
              key={ticket.id}
              to={`/tickets/${ticket.id}`}
              className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  #{ticket.id} – {ticket.title}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {ticket.category?.name ?? 'Sem categoria'} ·{' '}
                  {formatDistanceToNow(new Date(ticket.created_at), {
                    locale: ptBR,
                    addSuffix: true,
                  })}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <PriorityBadge priority={ticket.priority} />
                <StatusBadge status={ticket.status} />
              </div>
            </Link>
          ))}
          {!recentTickets?.data.results.length && (
            <div className="p-8 text-center text-gray-400">
              <Ticket size={32} className="mx-auto mb-2 opacity-40" />
              <p>Nenhum ticket ainda</p>
              <Link to="/tickets/new" className="text-primary-600 hover:underline text-sm mt-1 inline-block">
                Criar o primeiro ticket
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
