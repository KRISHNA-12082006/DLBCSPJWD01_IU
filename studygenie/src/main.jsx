import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

/**
 * main.jsx - Application entry point.
 * Mounts the React App component to the DOM inside #root element.
 * Uses React 18's createRoot API.
 */

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
