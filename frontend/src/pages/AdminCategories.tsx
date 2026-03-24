import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2, Tag } from 'lucide-react'
import { ticketsApi, type Category } from '../api/tickets'
import { Spinner } from '../components/Spinner'
import toast from 'react-hot-toast'

function CategoryForm({
  initial,
  onSubmit,
  onCancel,
  loading,
}: {
  initial?: Partial<Category>
  onSubmit: (data: { name: string; description: string; color: string }) => void
  onCancel: () => void
  loading: boolean
}) {
  const [form, setForm] = useState({
    name: initial?.name ?? '',
    description: initial?.description ?? '',
    color: initial?.color ?? '#6366f1',
  })
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit(form)
      }}
      className="space-y-3"
    >
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Nome *</label>
          <input className="input" value={form.name} onChange={set('name')} required />
        </div>
        <div>
          <label className="label">Cor</label>
          <div className="flex gap-2">
            <input
              type="color"
              className="h-[38px] w-12 rounded border border-gray-300 cursor-pointer p-0.5"
              value={form.color}
              onChange={set('color')}
            />
            <input className="input" value={form.color} onChange={set('color')} placeholder="#6366f1" />
          </div>
        </div>
      </div>
      <div>
        <label className="label">Descrição</label>
        <textarea
          className="input resize-none"
          rows={2}
          value={form.description}
          onChange={set('description')}
          placeholder="Opcional..."
        />
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? <Spinner className="w-4 h-4" /> : 'Salvar'}
        </button>
      </div>
    </form>
  )
}

export function AdminCategories() {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => ticketsApi.listCategories(),
  })

  const createMutation = useMutation({
    mutationFn: (d: Partial<Category>) => ticketsApi.createCategory(d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] })
      setShowForm(false)
      toast.success('Categoria criada!')
    },
    onError: () => toast.error('Erro ao criar categoria.'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, ...d }: Partial<Category> & { id: number }) =>
      ticketsApi.updateCategory(id, d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] })
      setEditing(null)
      toast.success('Categoria atualizada!')
    },
    onError: () => toast.error('Erro ao atualizar.'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => ticketsApi.deleteCategory(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] })
      toast.success('Categoria removida.')
    },
    onError: () => toast.error('Erro ao remover categoria.'),
  })

  const categories = data?.data ?? []

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categorias</h1>
          <p className="text-gray-500 text-sm mt-0.5">Gerencie as categorias de tickets</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          <Plus size={16} />
          Nova categoria
        </button>
      </div>

      {showForm && (
        <div className="card p-5 mb-4">
          <h3 className="font-semibold text-gray-900 mb-4">Nova categoria</h3>
          <CategoryForm
            onSubmit={(d) => createMutation.mutate(d)}
            onCancel={() => setShowForm(false)}
            loading={createMutation.isPending}
          />
        </div>
      )}

      <div className="card divide-y divide-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <Spinner className="w-6 h-6 text-primary-600" />
          </div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <Tag size={32} className="mx-auto mb-2 opacity-40" />
            <p>Nenhuma categoria cadastrada.</p>
          </div>
        ) : (
          categories.map((cat) => (
            <div key={cat.id}>
              {editing?.id === cat.id ? (
                <div className="p-5">
                  <CategoryForm
                    initial={cat}
                    onSubmit={(d) => updateMutation.mutate({ id: cat.id, ...d })}
                    onCancel={() => setEditing(null)}
                    loading={updateMutation.isPending}
                  />
                </div>
              ) : (
                <div className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900">{cat.name}</p>
                    {cat.description && (
                      <p className="text-sm text-gray-500 truncate">{cat.description}</p>
                    )}
                  </div>
                  <span className="text-xs text-gray-400">{cat.ticket_count} ticket{cat.ticket_count !== 1 ? 's' : ''}</span>
                  <div className="flex gap-1">
                    <button
                      className="btn-ghost p-2 text-gray-400 hover:text-primary-600"
                      onClick={() => setEditing(cat)}
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      className="btn-ghost p-2 text-gray-400 hover:text-red-600"
                      onClick={() => {
                        if (confirm('Remover esta categoria?')) deleteMutation.mutate(cat.id)
                      }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
