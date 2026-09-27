import { BrowserRouter } from 'react-router-dom'
import ReactDom from 'react-dom/client'
import './index.css'
import { App } from './App.jsx'
import { UserProvider } from './contexts/UserContext.jsx'

ReactDom.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <UserProvider>
      <App />
    </UserProvider>
  </BrowserRouter>,
)
