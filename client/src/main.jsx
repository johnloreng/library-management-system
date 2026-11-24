// Entry point: wraps <App /> in <BrowserRouter> for client-side routing
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* BrowserRouter enables React Router v6 routing throughout the app */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
