import React, { useState, useEffect } from 'react'
import Dashboard from './components/Dashboard/Dashboard'
import Report from './components/Report/Report'
import './App.css'

function App() {
  const [currentView, setCurrentView] = useState('dashboard')
  const [sessionData, setSessionData] = useState(null)

  return (
    <div className="app">
      <header className="app-header">
        <h1>Video Interview Proctoring System</h1>
        <nav>
          <button
            className={currentView === 'dashboard' ? 'active' : ''}
            onClick={() => setCurrentView('dashboard')}
          >
            Interview Dashboard
          </button>
          <button
            className={currentView === 'report' ? 'active' : ''}
            onClick={() => setCurrentView('report')}
          >
            View Reports
          </button>
        </nav>
      </header>
      <main className="app-main">
        {currentView === 'dashboard' && (
          <Dashboard onSessionComplete={setSessionData} />
        )}
        {currentView === 'report' && (
          <Report sessionData={sessionData} />
        )}
      </main>
    </div>
  )
}

export default App