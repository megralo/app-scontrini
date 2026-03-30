import { Outlet } from 'react-router-dom'
import BottomNav from './BottomNav.jsx'

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Main scrollable area — leaves room for the fixed bottom nav */}
      <main className="flex-1 overflow-y-auto pb-[calc(5rem+env(safe-area-inset-bottom,0px))]">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}