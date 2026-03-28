import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Search, PlusCircle, Filter } from 'lucide-react'
import { ticketsApi, type TicketsParams, type TicketStatus, type TicketPriority } from '../api/tickets'
import { StatusBadge } from '../components/StatusBadge'
import { PriorityBadge } from '../components/PriorityBadge'
import { Spinner } from '../components/Spinner'
import { Avatar } from '../components/Avatar'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const statusOptions: { value: TicketStatus | ''; label: string }[] = [
  { value: '', label: 'Todos os status' },
  { value: 'open', label: 'Aberto' },
  { value: 'in_progress', label: 'Em andamento' },
  { value: 'waiting', label: 'Aguardando' },
  { value: 'resolved', label: 'Resolvido' },
  { value: 'closed', label: 'Fechado' },
]

const priorityOptions: { value: TicketPriority | ''; label: string }[] = [
  { value: '', label: 'Todas as prioridades' },
  { value: 'low', label: 'Baixa' },
  { value: 'medium', label: 'Média' },
  { value: 'high', label: 'Alta' },
  { value: 'critical', label: 'Crítica' },
]

export function TicketList() {
  const [params, setParams] = useState<TicketsParams>({ page: 1 })
  const [search, setSearch] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['tickets', params],
    queryFn: () => ticketsApi.listTickets(params),
  })

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => ticketsApi.listCategories(),
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setParams((p) => ({ ...p, search, page: 1 }))
  }

  const setFilter = (key: keyof TicketsParams, value: any) =>
    setParams((p) => ({ ...p, [key]: value || undefined, page: 1 }))

  const tickets = data?.data.results ?? []
  const total = data?.data.count ?? 0
  const pageSize = 20
  const totalPages = Math.ceil(total / pageSize)
  const currentPage = params.page ?? 1

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tickets</h1>
          <p className="text-gray-500 text-sm mt-0.5 dark:text-gray-400">{total} ticket{total !== 1 ? 's' : ''} encontrado{total !== 1 ? 's' : ''}</p>
        </div>
        <Link to="/tickets/new" className="btn-primary">
          <PlusCircle size={16} />
          Novo ticket
        </Link>
      </div>

      <div className="card p-4 mb-4">
        <div className="flex flex-wrap gap-3">
          <form onSubmit={handleSearch} className="flex flex-1 min-w-[200px] gap-2">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                className="input pl-9"
                placeholder="Buscar tickets..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-secondary">
              <Filter size={16} />
              Buscar
            </button>
          </form>

          <select
            className="input w-auto"
            onChange={(e) => setFilter('status', e.target.value as TicketStatus)}
          >
            {statusOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          <select
            className="input w-auto"
            onChange={(e) => setFilter('priority', e.target.value as TicketPriority)}
          >
            {priorityOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          <select
            className="input w-auto"
            onChange={(e) => setFilter('category', Number(e.target.value) || undefined)}
          >
            <option value="">Todas as categorias</option>
            {categoriesData?.data.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <Spinner className="w-8 h-8 text-primary-600" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 dark:bg-gray-800/50 dark:border-gray-700">
                    <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-300">#</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-300">Título</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-300">Categoria</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-300">Status</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-300">Prioridade</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-300">Responsável</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-300">Atualizado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {tickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-gray-50 transition-colors dark:hover:bg-gray-800/50">
                      <td className="px-4 py-3 text-gray-400 dark:text-gray-500">{ticket.id}</td>
                      <td className="px-4 py-3">
                        <Link
                          to={`/tickets/${ticket.id}`}
                          className="font-medium text-gray-900 hover:text-primary-600 transition-colors dark:text-gray-100 dark:hover:text-primary-400"
                        >
                          {ticket.title}
                        </Link>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          {ticket.comment_count} comentário{ticket.comment_count !== 1 ? 's' : ''}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        {ticket.category ? (
                          <span
                            className="badge"
                            style={{ backgroundColor: ticket.category.color + '20', color: ticket.category.color }}
                          >
                            {ticket.category.name}
                          </span>
                        ) : (
                          <span className="text-gray-400 dark:text-gray-500">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={ticket.status} /></td>
                      <td className="px-4 py-3"><PriorityBadge priority={ticket.priority} /></td>
                      <td className="px-4 py-3">
                        {ticket.assigned_to ? (
                          <div className="flex items-center gap-2">
                            <Avatar name={ticket.assigned_to.name} src={ticket.assigned_to.avatar} size="sm" />
                            <span className="text-gray-600 dark:text-gray-300">{ticket.assigned_to.name.split(' ')[0]}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400 dark:text-gray-500">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs dark:text-gray-500">
                        {formatDistanceToNow(new Date(ticket.updated_at), { locale: ptBR, addSuffix: true })}
                      </td>
                    </tr>
                  ))}
                  {!tickets.length && (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center text-gray-400 dark:text-gray-500">
                        Nenhum ticket encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-gray-800">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Página {currentPage} de {totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    className="btn-secondary py-1.5"
                    disabled={currentPage === 1}
                    onClick={() => setParams((p) => ({ ...p, page: (p.page ?? 1) - 1 }))}
                  >
                    Anterior
                  </button>
                  <button
                    className="btn-secondary py-1.5"
                    disabled={currentPage === totalPages}
                    onClick={() => setParams((p) => ({ ...p, page: (p.page ?? 1) + 1 }))}
                  >
                    Próxima
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
