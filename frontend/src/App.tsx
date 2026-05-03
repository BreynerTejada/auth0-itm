import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider, createTheme, CssBaseline, CircularProgress, Box } from '@mui/material'
import { checkAuth } from './utils/auth'
import * as appStyles from './theme/appStyles'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'

const theme = createTheme({
  palette: {
    primary: { main: '#667eea' },
    secondary: { main: '#764ba2' },
    success: { main: '#4caf50' },
    error: { main: '#f44336' },
    background: { default: '#f5f5f5' },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 500 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' },
      },
    },
  },
})

type User = { email: string }

export default function App() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const authData = await checkAuth()
        setAuthenticated(authData.authenticated)
        if (authData.authenticated) {
          setUser(authData.user)
        }
      } catch {
        setAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }
    verifyAuth()
  }, [])

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={appStyles.loadingContainer}>
          <CircularProgress sx={{ color: 'white' }} />
        </Box>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={appStyles.appContainer}>
          <Routes>
            <Route path="/" element={<Home authenticated={authenticated ?? false} user={user} />} />
            <Route
              path="/dashboard"
              element={authenticated ? <Dashboard user={user ?? { email: '' }} /> : <Navigate to="/" replace />}
            />
            <Route
              path="/profile"
              element={authenticated ? <Profile user={user ?? { email: '' }} /> : <Navigate to="/" replace />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Box>
      </Router>
    </ThemeProvider>
  )
}
