import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bot, Eye, EyeOff } from 'lucide-react'
import { authApi } from '../api/auth'
import { useAuth } from '../contexts/AuthContext'
import { Spinner } from '../components/Spinner'
import toast from 'react-hot-toast'

export function Register() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
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
      const msg = data ? Object.values(data).flat().join(' ') : 'Erro ao criar conta.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-900 flex-col justify-center items-center p-12 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-white opacity-5" />
        <div className="absolute top-1/3 -right-16 w-56 h-56 rounded-full bg-white opacity-5" />
        <div className="absolute -bottom-12 left-1/3 w-48 h-48 rounded-full bg-white opacity-5" />

        <div className="relative z-10 text-center max-w-sm">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Bot size={32} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">Crie sua conta</h2>
          <p className="text-primary-100 text-sm leading-relaxed">
            Junte-se ao Desk AI e tenha acesso a um sistema de suporte com inteligência artificial integrada.
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50 overflow-y-auto">
        <div className="w-full max-w-md py-8">

          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
              <Bot size={22} className="text-white" />
            </div>
            <span className="text-gray-900 text-xl font-bold">Desk AI</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Criar conta</h1>
            <p className="text-gray-500 text-sm mt-1">Preencha os dados abaixo para se cadastrar</p>
          </div>

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
              <label className="label">
                Departamento
                <span className="text-gray-400 font-normal ml-1">(opcional)</span>
              </label>
              <input
                type="text"
                className="input"
                placeholder="TI, Financeiro, RH..."
                value={form.department}
                onChange={set('department')}
              />
            </div>

            <div>
              <label className="label">Senha</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input pr-10"
                  placeholder="Mínimo 8 caracteres"
                  value={form.password}
                  onChange={set('password')}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="label">Confirmar senha</label>
              <input
                type={showPassword ? 'text' : 'password'}
                className="input"
                placeholder="••••••••"
                value={form.password2}
                onChange={set('password2')}
                required
              />
            </div>

            <button
              type="submit"
              className="btn-primary w-full py-3 text-base mt-2"
              disabled={loading}
            >
              {loading ? <Spinner className="w-4 h-4" /> : 'Criar conta'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Já tem conta?{' '}
            <Link to="/login" className="text-primary-600 font-semibold hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </div>

    </div>
  )
}
