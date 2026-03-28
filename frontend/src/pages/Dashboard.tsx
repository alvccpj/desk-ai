import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import {
  Ticket,
  CheckCircle,
  Clock,
  AlertTriangle,
  PlusCircle,
  ArrowRight,
  Inbox,
  Bot,
} from 'lucide-react'
import { ticketsApi } from '../api/tickets'
import { useAuth } from '../contexts/AuthContext'
import { StatusBadge } from '../components/StatusBadge'
import { PriorityBadge } from '../components/PriorityBadge'
import { Spinner } from '../components/Spinner'
import { Avatar } from '../components/Avatar'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface StatCardProps {
  label: string
  value: number
  icon: React.ReactNode
  gradient: string
  iconBg: string
  to: string
}

function StatCard({ label, value, icon, gradient, iconBg, to }: StatCardProps) {
  return (
    <Link
      to={to}
      className={`relative overflow-hidden rounded-2xl p-6 text-white flex flex-col justify-between min-h-[130px] shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200 ${gradient}`}
    >
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconBg}`}>
        {icon}
      </div>
      <div>
        <p className="text-3xl font-bold leading-none mb-1">{value}</p>
        <p className="text-sm font-medium opacity-80">{label}</p>
      </div>
      <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-10 bg-white" />
      <div className="absolute -right-2 top-2 w-16 h-16 rounded-full opacity-10 bg-white" />
    </Link>
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

  const recent = recentTickets?.data.results.slice(0, 6) ?? []
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite'

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">

      {/* Hero banner */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-primary-600 via-primary-700 to-indigo-800 p-7 text-white shadow-lg">
        <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Bot size={18} className="opacity-70" />
              <span className="text-sm font-medium opacity-70">Desk AI</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold">
              {greeting}, {user?.name.split(' ')[0]}!
            </h1>
            <p className="mt-1 text-sm opacity-75">
              Aqui está o resumo do seu suporte hoje
            </p>
          </div>
          <Link
            to="/tickets/new"
            className="flex items-center gap-2 bg-white text-primary-700 font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-primary-50 transition-colors shadow"
          >
            <PlusCircle size={16} />
            Novo ticket
          </Link>
        </div>

        {/* decorative circles */}
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white opacity-5" />
        <div className="absolute top-4 right-24 w-20 h-20 rounded-full bg-white opacity-5" />
        <div className="absolute -bottom-6 right-8 w-28 h-28 rounded-full bg-white opacity-5" />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Tickets abertos"
          value={openTickets?.data.count ?? 0}
          icon={<Ticket size={22} className="text-white" />}
          gradient="bg-gradient-to-br from-blue-500 to-blue-700"
          iconBg="bg-white/20"
          to="/tickets?status=open"
        />
        <StatCard
          label="Em andamento"
          value={inProgressTickets?.data.count ?? 0}
          icon={<Clock size={22} className="text-white" />}
          gradient="bg-gradient-to-br from-amber-400 to-orange-500"
          iconBg="bg-white/20"
          to="/tickets?status=in_progress"
        />
        <StatCard
          label="Resolvidos"
          value={resolvedTickets?.data.count ?? 0}
          icon={<CheckCircle size={22} className="text-white" />}
          gradient="bg-gradient-to-br from-emerald-400 to-green-600"
          iconBg="bg-white/20"
          to="/tickets?status=resolved"
        />
        <StatCard
          label="Críticos"
          value={criticalTickets?.data.count ?? 0}
          icon={<AlertTriangle size={22} className="text-white" />}
          gradient="bg-gradient-to-br from-red-500 to-rose-700"
          iconBg="bg-white/20"
          to="/tickets?priority=critical"
        />
      </div>

      {/* Recent tickets */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <h2 className="font-semibold text-gray-900 text-base dark:text-white">Tickets recentes</h2>
          <Link
            to="/tickets"
            className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 font-medium dark:text-primary-400 dark:hover:text-primary-300"
          >
            Ver todos
            <ArrowRight size={14} />
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="py-16 flex flex-col items-center text-gray-400 dark:text-gray-500">
            <Inbox size={40} className="mb-3 opacity-40" />
            <p className="font-medium text-gray-500 dark:text-gray-400">Nenhum ticket ainda</p>
            <p className="text-sm mt-1 dark:text-gray-500">Crie seu primeiro ticket para começar</p>
            <Link to="/tickets/new" className="btn-primary mt-4 text-sm">
              <PlusCircle size={15} />
              Criar ticket
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50 dark:divide-gray-800">
            {recent.map((ticket) => (
              <Link
                key={ticket.id}
                to={`/tickets/${ticket.id}`}
                className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors group dark:hover:bg-gray-800/60"
              >
                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600 text-xs font-bold dark:bg-primary-900/35 dark:text-primary-300">
                  #{ticket.id}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-primary-600 transition-colors dark:text-gray-100 dark:group-hover:text-primary-400">
                    {ticket.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-400 dark:text-gray-500">
                    <span>{ticket.category?.name ?? 'Sem categoria'}</span>
                    <span>·</span>
                    <span>
                      {formatDistanceToNow(new Date(ticket.updated_at), {
                        locale: ptBR,
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <PriorityBadge priority={ticket.priority} />
                  <StatusBadge status={ticket.status} />
                  {ticket.assigned_to && (
                    <Avatar
                      name={ticket.assigned_to.name}
                      src={ticket.assigned_to.avatar}
                      size="sm"
                    />
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
