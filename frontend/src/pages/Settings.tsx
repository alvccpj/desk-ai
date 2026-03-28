import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { User, Lock, Camera } from 'lucide-react'
import { authApi } from '../api/auth'
import { useAuth } from '../contexts/AuthContext'
import { Avatar } from '../components/Avatar'
import { Spinner } from '../components/Spinner'
import toast from 'react-hot-toast'

export function Settings() {
  const { user, refreshUser } = useAuth()
  const [profileForm, setProfileForm] = useState({
    name: user?.name ?? '',
    department: user?.department ?? '',
  })
  const [passwordForm, setPasswordForm] = useState({
    old_password: '',
    new_password: '',
    confirm: '',
  })

  const updateProfile = useMutation({
    mutationFn: () => authApi.updateMe(profileForm),
    onSuccess: () => {
      refreshUser()
      toast.success('Perfil atualizado!')
    },
    onError: () => toast.error('Erro ao atualizar perfil.'),
  })

  const changePassword = useMutation({
    mutationFn: () =>
      authApi.changePassword({
        old_password: passwordForm.old_password,
        new_password: passwordForm.new_password,
      }),
    onSuccess: () => {
      setPasswordForm({ old_password: '', new_password: '', confirm: '' })
      toast.success('Senha alterada com sucesso!')
    },
    onError: (err: any) => {
      const msg = err.response?.data?.old_password?.[0] || 'Erro ao alterar senha.'
      toast.error(msg)
    },
  })

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const fd = new FormData()
    fd.append('avatar', file)
    try {
      await authApi.updateMe(fd)
      await refreshUser()
      toast.success('Avatar atualizado!')
    } catch {
      toast.error('Erro ao atualizar avatar.')
    }
    e.target.value = ''
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordForm.new_password !== passwordForm.confirm) {
      toast.error('As novas senhas não coincidem.')
      return
    }
    changePassword.mutate()
  }

  if (!user) return null

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Configurações</h1>

      {/* Profile */}
      <div className="card p-6 mb-6">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <User size={18} />
          Perfil
        </h2>
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <Avatar name={user.name} src={user.avatar} size="lg" />
            <label className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-700 transition-colors">
              <Camera size={13} className="text-white" />
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </label>
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
            <span className="badge bg-primary-100 text-primary-700 mt-1 capitalize dark:bg-primary-900/40 dark:text-primary-300">{user.role}</span>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            updateProfile.mutate()
          }}
          className="space-y-4"
        >
          <div>
            <label className="label">Nome</label>
            <input
              className="input"
              value={profileForm.name}
              onChange={(e) => setProfileForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="label">Departamento</label>
            <input
              className="input"
              value={profileForm.department}
              onChange={(e) => setProfileForm((f) => ({ ...f, department: e.target.value }))}
              placeholder="Ex: TI, Financeiro..."
            />
          </div>
          <div className="flex justify-end">
            <button type="submit" className="btn-primary" disabled={updateProfile.isPending}>
              {updateProfile.isPending ? <Spinner className="w-4 h-4" /> : 'Salvar'}
            </button>
          </div>
        </form>
      </div>

      {/* Password */}
      <div className="card p-6">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Lock size={18} />
          Alterar senha
        </h2>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="label">Senha atual</label>
            <input
              type="password"
              className="input"
              value={passwordForm.old_password}
              onChange={(e) => setPasswordForm((f) => ({ ...f, old_password: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="label">Nova senha</label>
            <input
              type="password"
              className="input"
              value={passwordForm.new_password}
              onChange={(e) => setPasswordForm((f) => ({ ...f, new_password: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="label">Confirmar nova senha</label>
            <input
              type="password"
              className="input"
              value={passwordForm.confirm}
              onChange={(e) => setPasswordForm((f) => ({ ...f, confirm: e.target.value }))}
              required
            />
          </div>
          <div className="flex justify-end">
            <button type="submit" className="btn-primary" disabled={changePassword.isPending}>
              {changePassword.isPending ? <Spinner className="w-4 h-4" /> : 'Alterar senha'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
