import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './legacy-widgets.css'
import App from './App.jsx'

// Vite entry point: load the shared stylesheet, then mount the documented page shell.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
