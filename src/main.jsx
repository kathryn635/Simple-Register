import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'  //  добавляем
import App from './App'
import './styles/SimpleRegister.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>  {/* оборачиваем App */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
)