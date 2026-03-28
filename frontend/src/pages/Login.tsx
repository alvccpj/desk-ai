import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bot, Ticket, Zap, ShieldCheck, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { Spinner } from '../components/Spinner'
import { ThemeToggle } from '../components/ThemeToggle'
import toast from 'react-hot-toast'

const features = [
  { icon: <Ticket size={18} />, text: 'Gerencie tickets de suporte com facilidade' },
  { icon: <Zap size={18} />, text: 'Sugestões inteligentes com Google Gemini AI' },
  { icon: <ShieldCheck size={18} />, text: 'Controle de acesso por perfil de usuário' },
]

export function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch {
      toast.error('E-mail ou senha inválidos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-900 flex-col justify-between p-12 overflow-hidden">
        {/* decorative circles */}
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-white opacity-5" />
        <div className="absolute top-1/3 -right-16 w-56 h-56 rounded-full bg-white opacity-5" />
        <div className="absolute -bottom-12 left-1/3 w-48 h-48 rounded-full bg-white opacity-5" />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Bot size={22} className="text-white" />
            </div>
            <span className="text-white text-xl font-bold">Desk AI</span>
          </div>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="text-4xl font-bold text-white leading-tight">
              Suporte inteligente,<br />
              <span className="text-primary-200">resultados reais.</span>
            </h2>
            <p className="mt-4 text-primary-100 text-base leading-relaxed max-w-sm">
              Uma plataforma de help desk com inteligência artificial integrada para agilizar o atendimento.
            </p>
          </div>

          <ul className="space-y-4">
            {features.map((f, i) => (
              <li key={i} className="flex items-center gap-3 text-primary-100">
                <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
                  {f.icon}
                </span>
                <span className="text-sm">{f.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 text-primary-300 text-xs">
          © {new Date().getFullYear()} Desk AI. Todos os direitos reservados.
        </p>
      </div>

      {/* Right panel — form */}
      <div className="relative w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-950">
        <div className="absolute top-4 right-4 z-10">
          <ThemeToggle />
        </div>
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
              <Bot size={22} className="text-white" />
            </div>
            <span className="text-gray-900 text-xl font-bold dark:text-white">Desk AI</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Seja Bem-vindo!</h1>
            <p className="text-gray-500 text-sm mt-1 dark:text-gray-400">Entre com suas credenciais para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">E-mail</label>
              <input
                type="email"
                className="input"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div>
              <label className="label">Senha</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input pr-10"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors dark:hover:text-gray-300"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary w-full py-3 text-base"
              disabled={loading}
            >
              {loading ? <Spinner className="w-4 h-4" /> : 'Entrar'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6 dark:text-gray-400">
            Não tem conta?{' '}
            <Link to="/register" className="text-primary-600 font-semibold hover:underline dark:text-primary-400">
              Cadastre-se grátis
            </Link>
          </p>
        </div>
      </div>

    </div>
  )
}
