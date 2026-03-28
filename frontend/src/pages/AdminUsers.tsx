import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, Users } from 'lucide-react'
import { authApi } from '../api/auth'
import { Avatar } from '../components/Avatar'
import { Spinner } from '../components/Spinner'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const roleLabel: Record<string, string> = {
  admin: 'Administrador',
  agent: 'Agente',
  client: 'Cliente',
}

const roleColor: Record<string, string> = {
  admin: 'badge bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-200',
  agent: 'badge bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-200',
  client: 'badge bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
}

export function AdminUsers() {
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['users', role, search],
    queryFn: () => authApi.listUsers({ role: role || undefined, search: search || undefined }),
  })

  const users = data?.data.results ?? []

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Usuários</h1>
        <p className="text-gray-500 text-sm mt-0.5 dark:text-gray-400">
          {data?.data.count ?? 0} usuário{(data?.data.count ?? 0) !== 1 ? 's' : ''} cadastrado{(data?.data.count ?? 0) !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="card p-4 mb-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            className="input pl-9"
            placeholder="Buscar por nome ou e-mail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className="input w-auto" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="">Todos os perfis</option>
          <option value="admin">Administrador</option>
          <option value="agent">Agente</option>
          <option value="client">Cliente</option>
        </select>
      </div>

      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <Spinner className="w-7 h-7 text-primary-600" />
          </div>
        ) : users.length === 0 ? (
          <div className="p-10 text-center text-gray-400 dark:text-gray-500">
            <Users size={32} className="mx-auto mb-2 opacity-40" />
            <p>Nenhum usuário encontrado.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 dark:bg-gray-800/50 dark:border-gray-700">
                <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-300">Usuário</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-300">Perfil</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-300">Departamento</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-300">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-300">Membro desde</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={u.name} src={u.avatar} size="sm" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{u.name}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={roleColor[u.role] ?? 'badge bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'}>
                      {roleLabel[u.role] ?? u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{u.department || '—'}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`badge ${u.is_active ? 'bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-200' : 'bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-300'}`}
                    >
                      {u.is_active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs dark:text-gray-500">
                    {format(new Date(u.date_joined), 'dd/MM/yyyy', { locale: ptBR })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
