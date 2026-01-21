import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import Providers from './redux/Providers.jsx'
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
   <Providers>
     <App />
   </Providers>
  </BrowserRouter>,
)
