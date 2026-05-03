import { useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider, createTheme, CssBaseline, CircularProgress, Box } from '@mui/material'
import { initApiAuth } from './utils/api'
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
    fontFamily: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Arial', 'sans-serif'].join(','),
  },
  components: {
    MuiButton: { styleOverrides: { root: { textTransform: 'none', fontWeight: 500 } } },
    MuiCard: { styleOverrides: { root: { boxShadow: '0 2px 8px rgba(0,0,0,0.1)' } } },
  },
})

type AuthUser = { email: string }

export default function App() {
  const { isAuthenticated, isLoading, user, getAccessTokenSilently } = useAuth0()

  useEffect(() => {
    if (isAuthenticated) {
      initApiAuth(() =>
        getAccessTokenSilently({
          authorizationParams: { audience: import.meta.env.VITE_AUTH0_AUDIENCE },
        })
      )
    }
  }, [isAuthenticated, getAccessTokenSilently])

  if (isLoading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={appStyles.loadingContainer}>
          <CircularProgress sx={{ color: 'white' }} />
        </Box>
      </ThemeProvider>
    )
  }

  const authUser: AuthUser | null =
    isAuthenticated && user ? { email: user.email ?? '' } : null

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={appStyles.appContainer}>
          <Routes>
            <Route path="/" element={<Home authenticated={isAuthenticated} user={authUser} />} />
            <Route
              path="/dashboard"
              element={isAuthenticated ? <Dashboard user={authUser!} /> : <Navigate to="/" replace />}
            />
            <Route
              path="/profile"
              element={isAuthenticated ? <Profile user={authUser!} /> : <Navigate to="/" replace />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Box>
      </Router>
    </ThemeProvider>
  )
}
