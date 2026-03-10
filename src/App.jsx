import { Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Dashboard from './pages/Dashboard'
import Tools from './pages/Tools'
import Analytics from './pages/Analytics'
import Header from './components/Header'

function App() {
  const [darkMode, setDarkMode] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  return (
    <div className="bg-gray-50 dark:bg-[#0f0f0f] min-h-screen transition-colors duration-300">
      <Header
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(d => !d)}
        search={search}
        onSearch={setSearch}
      />
      <main className="pt-14">
        <Routes>
          <Route path="/" element={<Dashboard search={search} />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </main>
    </div>
  )
}

export default App