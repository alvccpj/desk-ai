import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Ticket,
  PlusCircle,
  Users,
  Tag,
  Settings,
  LogOut,
  Bot,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { Avatar } from './Avatar'

interface NavItem {
  to: string
  label: string
  icon: React.ReactNode
  roles?: string[]
}

const navItems: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { to: '/tickets', label: 'Tickets', icon: <Ticket size={18} /> },
  { to: '/tickets/new', label: 'Novo Ticket', icon: <PlusCircle size={18} /> },
  { to: '/admin/users', label: 'Usuários', icon: <Users size={18} />, roles: ['admin'] },
  { to: '/admin/categories', label: 'Categorias', icon: <Tag size={18} />, roles: ['admin', 'agent'] },
]

export function Sidebar() {
  const { user, logout } = useAuth()

  const visible = navItems.filter(
    (item) => !item.roles || (user && item.roles.includes(user.role)),
  )

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
      <div className="p-5 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <Bot size={18} className="text-white" />
          </div>
          <span className="font-bold text-gray-900 text-lg">Desk AI</span>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {visible.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-gray-200 space-y-1">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-100'
            }`
          }
        >
          <Settings size={18} />
          Configurações
        </NavLink>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut size={18} />
          Sair
        </button>
      </div>

      {user && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <Avatar name={user.name} src={user.avatar} size="sm" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user.role}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}
