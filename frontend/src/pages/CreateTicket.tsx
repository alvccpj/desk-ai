import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { Wand2, PlusCircle, ArrowLeft } from 'lucide-react'
import { ticketsApi, type TicketPriority } from '../api/tickets'
import { Spinner } from '../components/Spinner'
import toast from 'react-hot-toast'

export function CreateTicket() {
  const navigate = useNavigate()
  const qc = useQueryClient()
  const [form, setForm] = useState({
    title: '',
    description: '',
    category_id: '' as number | '',
    priority: 'medium' as TicketPriority,
  })
  const [categorizing, setCategorizing] = useState(false)

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => ticketsApi.listCategories(),
  })

  const mutation = useMutation({
    mutationFn: () =>
      ticketsApi.createTicket({
        title: form.title,
        description: form.description,
        category_id: form.category_id || null,
        priority: form.priority,
      }),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['tickets'] })
      toast.success('Ticket criado! A IA está analisando...')
      navigate(`/tickets/${res.data.id}`)
    },
    onError: () => toast.error('Erro ao criar ticket.'),
  })

  const titleOk = form.title.trim().length > 0
  const descriptionOk = form.description.trim().length > 0
  const canSuggestCategory = titleOk && descriptionOk

  const handleAutoCategorize = async () => {
    if (!canSuggestCategory) {
      toast.error('Preencha título e descrição antes de usar a IA.')
      return
    }
    setCategorizing(true)
    try {
      const res = await ticketsApi.autoCategorize(
        form.title.trim(),
        form.description.trim(),
      )
      const suggested = (res.data.category || '').trim()
      if (!suggested) {
        toast.error(
          res.data.detail ||
            'Categoria vazia. Verifique GEMINI_API_KEY, dependências (pip) e reinicie o servidor.',
        )
        return
      }
      const list = Array.isArray(categoriesData?.data) ? categoriesData.data : []
      const sn = suggested.toLowerCase()
      const match =
        list.find((c) => c.name.toLowerCase() === sn) ||
        list.find((c) => sn.includes(c.name.toLowerCase()) || c.name.toLowerCase().includes(sn))
      if (match) {
        setForm((f) => ({ ...f, category_id: match.id }))
        toast.success(`Categoria sugerida: ${match.name}`)
      } else {
        toast(
          `A IA sugeriu "${suggested}", mas não coincide com nenhuma categoria cadastrada.`,
        )
      }
    } catch (err) {
      const detail = isAxiosError(err) ? (err.response?.data as { detail?: string } | undefined)?.detail : undefined
      if (isAxiosError(err) && err.response?.status === 503) {
        toast.error(
          detail ||
            'IA indisponível. Crie backend/.env com GEMINI_API_KEY (aistudio.google.com) e reinicie o runserver.',
        )
      } else if (isAxiosError(err) && err.response?.status === 400) {
        toast.error(detail || 'Não é possível categorizar: verifique as categorias do sistema.')
      } else if (isAxiosError(err) && err.response?.status === 403) {
        toast.error('Sem permissão para usar esta função.')
      } else {
        toast.error('Não foi possível obter a sugestão. Tente de novo.')
      }
    } finally {
      setCategorizing(false)
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="btn-ghost mb-4 -ml-2 text-gray-500 dark:text-gray-400"
      >
        <ArrowLeft size={16} />
        Voltar
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Novo Ticket</h1>
        <p className="text-gray-500 text-sm mt-0.5 dark:text-gray-400">
          Descreva seu problema e a IA irá sugerir uma solução
        </p>
      </div>

      <div className="card p-6">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            mutation.mutate()
          }}
          className="space-y-5"
        >
          <div>
            <label className="label">Título *</label>
            <input
              className="input"
              placeholder="Resuma o problema em uma frase"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              required
              autoFocus
            />
          </div>

          <div>
            <label className="label">Descrição *</label>
            <textarea
              className="input min-h-[120px] resize-y"
              placeholder="Descreva o problema com detalhes: o que aconteceu, quando, quais passos você já tentou..."
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              required
              rows={5}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Categoria</label>
              <div className="flex gap-2">
                <select
                  className="input flex-1"
                  value={form.category_id}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      category_id: e.target.value ? Number(e.target.value) : '',
                    }))
                  }
                >
                  <option value="">Selecionar...</option>
                  {categoriesData?.data.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="btn-secondary px-3 disabled:opacity-50"
                  title={
                    canSuggestCategory
                      ? 'Sugerir categoria via IA'
                      : 'Preencha título e descrição primeiro'
                  }
                  onClick={handleAutoCategorize}
                  disabled={categorizing || !canSuggestCategory}
                >
                  {categorizing ? <Spinner className="w-4 h-4" /> : <Wand2 size={16} />}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1 dark:text-gray-500">
                Preencha <strong className="font-medium text-gray-500 dark:text-gray-400">título</strong> e{' '}
                <strong className="font-medium text-gray-500 dark:text-gray-400">descrição</strong>; depois use{' '}
                <Wand2 size={10} className="inline" /> para sugerir a categoria (requer Gemini no servidor).
              </p>
              {categoriesData &&
                Array.isArray(categoriesData.data) &&
                categoriesData.data.length === 0 && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                    Nenhuma categoria no sistema. No backend, execute{' '}
                    <code className="rounded bg-gray-100 px-1 dark:bg-gray-800">python manage.py migrate</code>.
                  </p>
                )}
            </div>

            <div>
              <label className="label">Prioridade</label>
              <select
                className="input"
                value={form.priority}
                onChange={(e) =>
                  setForm((f) => ({ ...f, priority: e.target.value as TicketPriority }))
                }
              >
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
                <option value="critical">Crítica</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={mutation.isPending}>
              {mutation.isPending ? (
                <Spinner className="w-4 h-4" />
              ) : (
                <>
                  <PlusCircle size={16} />
                  Criar ticket
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
