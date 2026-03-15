import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '14px',
            borderRadius: '12px',
            border: '1px solid rgba(148,163,184,0.2)',
          },
          success: {
            style: {
              background: '#0f172a',
              color: '#e2e8f0',
              borderColor: 'rgba(16,185,129,0.3)',
            },
            iconTheme: { primary: '#10b981', secondary: '#0f172a' },
          },
          error: {
            style: {
              background: '#0f172a',
              color: '#e2e8f0',
              borderColor: 'rgba(239,68,68,0.3)',
            },
            iconTheme: { primary: '#ef4444', secondary: '#0f172a' },
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
)
