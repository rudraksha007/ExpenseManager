import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ProfileProvider } from './assets/UserProfile.jsx'

createRoot(document.getElementById('root')).render(
  <ProfileProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ProfileProvider>
)
