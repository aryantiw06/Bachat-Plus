import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { WalletProvider } from './contexts/WalletContext.jsx'
import { PremiumProvider } from './contexts/PremiumContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <WalletProvider>
        <PremiumProvider>
          <App />
        </PremiumProvider>
      </WalletProvider>
    </AuthProvider>
  </StrictMode>,
)
