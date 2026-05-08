import { AnimatePresence } from 'framer-motion'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { NotificationProvider } from '@/context/NotificationContext'
import { ThemeProvider } from '@/context/ThemeContext'
import Landing from '@/pages/Landing'
import Dashboard from '@/pages/Dashboard'
import Results from '@/pages/Results'

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/"              element={<Landing />} />
        <Route path="/dashboard"     element={<Dashboard />} />
        <Route path="/results/:id"   element={<Results />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <BrowserRouter>
          <AnimatedRoutes />
        </BrowserRouter>
      </NotificationProvider>
    </ThemeProvider>
  )
}
