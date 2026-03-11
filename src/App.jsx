import { Routes, Route, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Dashboard from './pages/Dashboard'
import Tools from './pages/Tools'
import Analytics from './pages/Analytics'
import Header from './components/Header'

function AppContent() {
  const [darkMode, setDarkMode] = useState(true)
  const [search, setSearch] = useState('')
  const location = useLocation()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  const searchPlaceholder = {
    '/': 'Search tools...',
    '/tools': 'Search in tools catalog...',
    '/analytics': 'Search metrics, insights...',
  }[location.pathname] ?? 'Search...'

  return (
    <div
      className="bg-gray-50 dark:bg-[#0a0a0a] min-h-screen transition-colors duration-300 bg-grid"
      style={{ '--grid-offset-y': '-32px' }}
    >
      <Header
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(d => !d)}
        search={search}
        onSearch={setSearch}
        placeholder={searchPlaceholder}
      />
      <main className="pt-14">
        <Routes>
          <Route path="/" element={<Dashboard search={search} />} />
          <Route path="/tools" element={<Tools search={search} />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return <AppContent />
}

export default App