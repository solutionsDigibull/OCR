import { useState } from 'react'
import { Sidebar } from './Sidebar'
import { Navbar } from './Navbar'

export function Layout({ children, breadcrumbs }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#0a0a0a] overflow-hidden">
      <Sidebar collapsed={collapsed} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Navbar
          onToggleSidebar={() => setCollapsed((c) => !c)}
          breadcrumbs={breadcrumbs}
        />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
