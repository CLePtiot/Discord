import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { AppProvider } from './contexts/AppContext'
import { VoiceProvider } from './contexts/VoiceContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppProvider>
      <VoiceProvider>
        <App />
      </VoiceProvider>
    </AppProvider>
  </StrictMode>,
)
