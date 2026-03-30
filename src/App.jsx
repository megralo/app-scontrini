import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout.jsx'
import Dashboard from './pages/Dashboard.jsx'

const Scan     = lazy(() => import('./pages/Scan.jsx'))
const History  = lazy(() => import('./pages/History.jsx'))
const Settings = lazy(() => import('./pages/Settings.jsx'))

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="scan"     element={<Suspense fallback={<div className="flex flex-1 items-center justify-center py-20"><div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" /></div>}><Scan /></Suspense>} />
        <Route path="history"  element={<Suspense fallback={<div className="flex flex-1 items-center justify-center py-20"><div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" /></div>}><History /></Suspense>} />
        <Route path="settings" element={<Suspense fallback={<div className="flex flex-1 items-center justify-center py-20"><div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" /></div>}><Settings /></Suspense>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}