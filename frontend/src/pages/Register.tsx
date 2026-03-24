import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bot } from 'lucide-react'
import { authApi } from '../api/auth'
import { useAuth } from '../contexts/AuthContext'
import { Spinner } from '../components/Spinner'
import toast from 'react-hot-toast'

export function Register() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    department: '',
    password: '',
    password2: '',
  })

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.password2) {
      toast.error('As senhas não coincidem.')
      return
    }
    setLoading(true)
    try {
      await authApi.register(form)
      await login(form.email, form.password)
      navigate('/dashboard')
      toast.success('Conta criada com sucesso!')
    } catch (err: any) {
      const data = err.response?.data
      const msg = data
        ? Object.values(data).flat().join(' ')
        : 'Erro ao criar conta.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-600 rounded-2xl mb-4">
            <Bot size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Desk AI</h1>
          <p className="text-gray-500 mt-1">Crie sua conta gratuita</p>
        </div>

        <div className="card p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Cadastro</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Nome completo</label>
              <input
                type="text"
                className="input"
                placeholder="João Silva"
                value={form.name}
                onChange={set('name')}
                required
                autoFocus
              />
            </div>
            <div>
              <label className="label">E-mail</label>
              <input
                type="email"
                className="input"
                placeholder="joao@empresa.com"
                value={form.email}
                onChange={set('email')}
                required
              />
            </div>
            <div>
              <label className="label">Departamento (opcional)</label>
              <input
                type="text"
                className="input"
                placeholder="TI, Financeiro..."
                value={form.department}
                onChange={set('department')}
              />
            </div>
            <div>
              <label className="label">Senha</label>
              <input
                type="password"
                className="input"
                placeholder="Mínimo 8 caracteres"
                value={form.password}
                onChange={set('password')}
                required
              />
            </div>
            <div>
              <label className="label">Confirmar senha</label>
              <input
                type="password"
                className="input"
                placeholder="••••••••"
                value={form.password2}
                onChange={set('password2')}
                required
              />
            </div>
            <button type="submit" className="btn-primary w-full py-2.5 mt-2" disabled={loading}>
              {loading ? <Spinner className="w-4 h-4" /> : 'Criar conta'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6">
            Já tem conta?{' '}
            <Link to="/login" className="text-primary-600 font-medium hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
