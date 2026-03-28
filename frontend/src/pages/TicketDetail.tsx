import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  ArrowLeft, Bot, Sparkles, Paperclip, Send, Lock, Trash2, RefreshCw,
} from 'lucide-react'
import { ticketsApi, type TicketStatus, type TicketPriority } from '../api/tickets'
import { authApi } from '../api/auth'
import { useAuth } from '../contexts/AuthContext'
import { StatusBadge } from '../components/StatusBadge'
import { PriorityBadge } from '../components/PriorityBadge'
import { Avatar } from '../components/Avatar'
import { Spinner } from '../components/Spinner'
import { formatDistanceToNow, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import toast from 'react-hot-toast'

export function TicketDetail() {
  const { id } = useParams<{ id: string }>()
  const ticketId = Number(id)
  const navigate = useNavigate()
  const { user } = useAuth()
  const qc = useQueryClient()

  const [comment, setComment] = useState('')
  const [isInternal, setIsInternal] = useState(false)
  const [loadingAI, setLoadingAI] = useState(false)
  const [loadingSummary, setLoadingSummary] = useState(false)
  const [summary, setSummary] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['ticket', ticketId],
    queryFn: () => ticketsApi.getTicket(ticketId),
  })

  const { data: agentsData } = useQuery({
    queryKey: ['users', 'agent'],
    queryFn: () => authApi.listUsers({ role: 'agent' }),
    enabled: user?.role === 'admin',
  })

  const ticket = data?.data

  const invalidate = () => qc.invalidateQueries({ queryKey: ['ticket', ticketId] })

  const addComment = useMutation({
    mutationFn: () =>
      ticketsApi.createComment(ticketId, { content: comment, is_internal: isInternal }),
    onSuccess: () => {
      setComment('')
      setIsInternal(false)
      invalidate()
    },
    onError: () => toast.error('Erro ao adicionar comentário.'),
  })

  const deleteComment = useMutation({
    mutationFn: (commentId: number) => ticketsApi.deleteComment(ticketId, commentId),
    onSuccess: () => { invalidate(); toast.success('Comentário removido.') },
  })

  const updateTicket = (patch: Record<string, any>) =>
    ticketsApi.updateTicket(ticketId, patch).then(() => {
      invalidate()
      qc.invalidateQueries({ queryKey: ['tickets'] })
    })

  const handleAISuggest = async () => {
    setLoadingAI(true)
    try {
      await ticketsApi.aiSuggest(ticketId)
      invalidate()
      toast.success('Sugestão gerada!')
    } catch {
      toast.error('IA não disponível.')
    } finally {
      setLoadingAI(false)
    }
  }

  const handleSummarize = async () => {
    setLoadingSummary(true)
    try {
      const res = await ticketsApi.summarize(ticketId)
      setSummary(res.data.summary)
    } catch {
      toast.error('IA não disponível.')
    } finally {
      setLoadingSummary(false)
    }
  }

  const handleAttach = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      await ticketsApi.uploadAttachment(ticketId, file)
      invalidate()
      toast.success('Arquivo anexado!')
    } catch {
      toast.error('Erro ao anexar arquivo.')
    }
    e.target.value = ''
  }

  const isAgent = user?.role === 'admin' || user?.role === 'agent'

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner className="w-8 h-8 text-primary-600" />
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className="p-6 text-center text-gray-500 dark:text-gray-400">
        Ticket não encontrado.
        <button onClick={() => navigate('/tickets')} className="btn-secondary mt-4">
          Voltar para tickets
        </button>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <button onClick={() => navigate(-1)} className="btn-ghost mb-4 -ml-2 text-gray-500 dark:text-gray-400">
        <ArrowLeft size={16} />
        Voltar
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Header */}
          <div className="card p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-gray-400 dark:text-gray-500">#{ticket.id}</span>
                  <StatusBadge status={ticket.status} />
                  <PriorityBadge priority={ticket.priority} />
                </div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">{ticket.title}</h1>
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-400 dark:text-gray-500">
                  <span>Criado por {ticket.created_by.name}</span>
                  <span>·</span>
                  <span>
                    {formatDistanceToNow(new Date(ticket.created_at), {
                      locale: ptBR,
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap bg-gray-50 rounded-lg p-4 dark:bg-gray-800/60 dark:text-gray-200">
              {ticket.description}
            </div>
          </div>

          {/* AI Suggestion */}
          {(ticket.ai_suggestion || isAgent) && (
            <div className="card p-5 border-primary-200 bg-primary-50/30 dark:border-primary-800 dark:bg-primary-900/20">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-primary-800 flex items-center gap-2 dark:text-primary-200">
                  <Bot size={16} className="text-primary-600 dark:text-primary-400" />
                  Sugestão da IA
                </h3>
                {isAgent && (
                  <button
                    className="btn-ghost text-primary-600 text-xs py-1 px-2 dark:text-primary-400"
                    onClick={handleAISuggest}
                    disabled={loadingAI}
                  >
                    {loadingAI ? <Spinner className="w-3 h-3" /> : <RefreshCw size={13} />}
                    Gerar nova
                  </button>
                )}
              </div>
              {ticket.ai_suggestion ? (
                <p className="text-sm text-gray-700 whitespace-pre-wrap dark:text-gray-200">{ticket.ai_suggestion}</p>
              ) : (
                <p className="text-sm text-gray-400 italic dark:text-gray-500">
                  Clique em "Gerar nova" para obter uma sugestão da IA.
                </p>
              )}
            </div>
          )}

          {/* Summary */}
          {(summary || isAgent) && (
            <div className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2 dark:text-white">
                  <Sparkles size={16} className="text-yellow-500 dark:text-yellow-400" />
                  Resumo executivo
                </h3>
                {isAgent && !summary && (
                  <button
                    className="btn-secondary text-xs py-1 px-3"
                    onClick={handleSummarize}
                    disabled={loadingSummary}
                  >
                    {loadingSummary ? <Spinner className="w-3 h-3" /> : 'Gerar resumo'}
                  </button>
                )}
              </div>
              {summary && <p className="text-sm text-gray-700 whitespace-pre-wrap dark:text-gray-200">{summary}</p>}
            </div>
          )}

          {/* Attachments */}
          {ticket.attachments.length > 0 && (
            <div className="card p-5">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 dark:text-white">
                <Paperclip size={16} />
                Anexos ({ticket.attachments.length})
              </h3>
              <div className="space-y-2">
                {ticket.attachments.map((att) => (
                  <a
                    key={att.id}
                    href={att.file}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-sm text-primary-600 hover:underline dark:text-primary-400"
                  >
                    <Paperclip size={14} />
                    {att.filename}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Comments */}
          <div className="card">
            <div className="p-5 border-b border-gray-100 dark:border-gray-800">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Comentários ({ticket.comments.length})
              </h3>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {ticket.comments.map((c) => (
                <div
                  key={c.id}
                  className={`p-5 ${c.is_internal ? 'bg-amber-50 dark:bg-amber-950/30' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <Avatar name={c.author.name} src={c.author.avatar} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{c.author.name}</span>
                        {c.is_internal && (
                          <span className="badge bg-amber-100 text-amber-700 flex items-center gap-1 dark:bg-amber-950/50 dark:text-amber-200">
                            <Lock size={10} />
                            Nota interna
                          </span>
                        )}
                        <span className="text-xs text-gray-400 ml-auto dark:text-gray-500">
                          {format(new Date(c.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap dark:text-gray-200">{c.content}</p>
                    </div>
                    {(user?.id === c.author.id || user?.role === 'admin') && (
                      <button
                        className="text-gray-300 hover:text-red-500 transition-colors p-1 dark:text-gray-600 dark:hover:text-red-400"
                        onClick={() => deleteComment.mutate(c.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {!ticket.comments.length && (
                <p className="p-6 text-center text-gray-400 text-sm dark:text-gray-500">
                  Nenhum comentário ainda. Seja o primeiro a responder!
                </p>
              )}
            </div>

            {/* Comment form */}
            <div className="p-5 border-t border-gray-100 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-800/30">
              <textarea
                className="input resize-none mb-3"
                placeholder={isInternal ? 'Nota interna (visível apenas para agentes)...' : 'Escreva um comentário...'}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {isAgent && (
                    <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none dark:text-gray-300">
                      <input
                        type="checkbox"
                        checked={isInternal}
                        onChange={(e) => setIsInternal(e.target.checked)}
                        className="rounded"
                      />
                      <Lock size={14} />
                      Nota interna
                    </label>
                  )}
                  <label className="btn-ghost text-xs cursor-pointer">
                    <Paperclip size={14} />
                    Anexar
                    <input type="file" className="hidden" onChange={handleAttach} />
                  </label>
                </div>
                <button
                  className="btn-primary"
                  onClick={() => addComment.mutate()}
                  disabled={!comment.trim() || addComment.isPending}
                >
                  {addComment.isPending ? <Spinner className="w-4 h-4" /> : <Send size={14} />}
                  Enviar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="card p-5 space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Detalhes</h3>

            <div>
              <label className="label text-xs">Status</label>
              {isAgent ? (
                <select
                  className="input"
                  value={ticket.status}
                  onChange={(e) => updateTicket({ status: e.target.value as TicketStatus })}
                >
                  <option value="open">Aberto</option>
                  <option value="in_progress">Em andamento</option>
                  <option value="waiting">Aguardando</option>
                  <option value="resolved">Resolvido</option>
                  <option value="closed">Fechado</option>
                </select>
              ) : (
                <StatusBadge status={ticket.status} />
              )}
            </div>

            <div>
              <label className="label text-xs">Prioridade</label>
              {isAgent ? (
                <select
                  className="input"
                  value={ticket.priority}
                  onChange={(e) => updateTicket({ priority: e.target.value as TicketPriority })}
                >
                  <option value="low">Baixa</option>
                  <option value="medium">Média</option>
                  <option value="high">Alta</option>
                  <option value="critical">Crítica</option>
                </select>
              ) : (
                <PriorityBadge priority={ticket.priority} />
              )}
            </div>

            <div>
              <label className="label text-xs">Categoria</label>
              <div
                className="badge"
                style={
                  ticket.category
                    ? { backgroundColor: ticket.category.color + '20', color: ticket.category.color }
                    : {}
                }
              >
                {ticket.category?.name ?? '—'}
              </div>
            </div>

            {user?.role === 'admin' && agentsData && (
              <div>
                <label className="label text-xs">Responsável</label>
                <select
                  className="input"
                  value={ticket.assigned_to?.id ?? ''}
                  onChange={(e) =>
                    updateTicket({ assigned_to_id: e.target.value ? Number(e.target.value) : null })
                  }
                >
                  <option value="">Não atribuído</option>
                  {agentsData.data.results.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <hr className="border-gray-100 dark:border-gray-800" />

            <div className="text-xs text-gray-400 space-y-1 dark:text-gray-500">
              <p>
                <span className="font-medium text-gray-600 dark:text-gray-400">Criado por: </span>
                {ticket.created_by.name}
              </p>
              <p>
                <span className="font-medium text-gray-600 dark:text-gray-400">Criado em: </span>
                {format(new Date(ticket.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </p>
              <p>
                <span className="font-medium text-gray-600 dark:text-gray-400">Atualizado: </span>
                {formatDistanceToNow(new Date(ticket.updated_at), { locale: ptBR, addSuffix: true })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

