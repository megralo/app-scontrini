import { NavLink, useLocation } from 'react-router-dom'
import { LayoutDashboard, ScanLine, Clock, Settings } from 'lucide-react'

const TABS = [
  { to: '/',         label: 'Dashboard', Icon: LayoutDashboard },
  { to: '/scan',     label: 'Scansiona',  Icon: ScanLine },
  { to: '/history',  label: 'Storico',   Icon: Clock },
  { to: '/settings', label: 'Impostazioni', Icon: Settings },
]

export default function BottomNav() {
  const { pathname } = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 pb-safe">
      <div className="flex">
        {TABS.map(({ to, label, Icon }) => {
          const isActive = to === '/' ? pathname === '/' : pathname.startsWith(to)
          return (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-1 flex-col items-center gap-1 py-2 text-xs font-medium transition-colors ${
                isActive ? 'text-blue-600' : 'text-gray-500'
              }`}
            >
              <Icon size={22} strokeWidth={1.8} aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}