import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import Cartprovider from './ContextProviders/Cartprovider.jsx'
import UserProvider from './ContextProviders/UserProvider.jsx'
import Productprovider from './ContextProviders/Productprovider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <Cartprovider>
        <Productprovider>
          <BrowserRouter basename="/FootWorld">
            <App />
          </BrowserRouter>
        </Productprovider>
      </Cartprovider>
    </UserProvider>
  </StrictMode>,
)
