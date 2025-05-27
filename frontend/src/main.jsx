import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import App from './App'
import theme from './theme'
import { AuthProvider } from './context/AuthContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <App />
          <ToastContainer position="top-right" autoClose={3000} />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  </React.StrictMode>
)