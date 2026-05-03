import { Link as RouterLink } from 'react-router-dom'
import {
  Box,
  Container,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Card,
  Grid,
  Paper,
  Stack,
} from '@mui/material'
import { Lock, Edit, Rocket } from '@mui/icons-material'
import * as styles from '../theme/homeStyles'
import LoginButton from '../components/LoginButton'
import LogoutButton from '../components/LogoutButton'

type User = { email: string }

export default function Home({ authenticated, user }: { authenticated: boolean; user: User | null }) {
  return (
    <Box sx={styles.homeContainer}>
      <AppBar position="static" sx={styles.header}>
        <Toolbar sx={styles.headerToolbar}>
          <Typography variant="h6" sx={styles.headerTitle}>
            ITM - Aplicaciones y Servicios Web | Integración con Auth0
          </Typography>
          <Box sx={styles.headerNav}>
            {authenticated && user ? (
              <>
                <Typography sx={styles.headerNavTypography}>{user.email}</Typography>
                <LogoutButton />
              </>
            ) : (
              <LoginButton />
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={styles.mainContent}>
        <Container maxWidth="md" sx={{ py: 6 }}>
          <Paper sx={styles.heroSection}>
            <Typography variant="h2" sx={styles.heroTitle}>
              Integración de Auth0
            </Typography>
            <Typography variant="h5" sx={styles.heroSubtitle}>
              Aplicación de Servicios Web - Integración con Auth0
            </Typography>
          </Paper>

          {authenticated && user ? (
            <Paper sx={styles.authenticatedPaper}>
              <Typography variant="h4" sx={styles.userGreeting}>
                ¡Hola, {user.email}!
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
                Has iniciado sesión exitosamente con Auth0.
              </Typography>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
                <Button
                  component={RouterLink}
                  to="/dashboard"
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{ textTransform: 'none', fontSize: '1rem' }}
                >
                  Ir al Dashboard
                </Button>
                <Button
                  component={RouterLink}
                  to="/profile"
                  variant="outlined"
                  color="primary"
                  size="large"
                  sx={{ textTransform: 'none', fontSize: '1rem' }}
                >
                  Editar Perfil
                </Button>
              </Stack>

              <Paper sx={styles.userInfoPaper}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                  Información de Cuenta
                </Typography>
                <Typography variant="body2">
                  <strong>Email:</strong> {user.email}
                </Typography>
              </Paper>
            </Paper>
          ) : (
            <>
              <Paper sx={styles.authenticatedPaper}>
                <Typography variant="h4" sx={styles.userGreeting}>
                  Auth0 - Autenticación Simplificada
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
                  Esta es una aplicación desarrollada como parte del taller evaluativo para demostrar
                  la integración con Auth0.
                </Typography>

                <Grid container spacing={3} sx={{ mt: 1 }}>
                  {[
                    { icon: <Lock fontSize="large" />, title: 'Autenticación Segura' },
                    {
                      icon: <Edit fontSize="large" />,
                      title: 'Gestión de Perfil',
                      desc: 'Actualiza tu información personal de forma segura. Los datos se guardan en Auth0 y persisten entre sesiones.',
                    },
                    { icon: <Rocket fontSize="large" />, title: 'Dashboard Personal' },
                  ].map((feature, idx) => (
                    <Grid size={12} key={idx}>
                      <Card sx={styles.featureCard}>
                        <Box sx={styles.featureIcon}>{feature.icon}</Box>
                        <Typography variant="h6" sx={styles.featureTitle}>
                          {feature.title}
                        </Typography>
                        <Typography variant="body2" sx={styles.featureDes}>
                          {feature.desc}
                        </Typography>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Paper>

              <Paper sx={styles.ctaSection}>
                <LoginButton />
              </Paper>
            </>
          )}
        </Container>
      </Box>

      <Box component="footer" sx={styles.footer}>
        <Typography variant="body2">
          Institución Universitaria Tecnológica Metropolitana (ITM) — 2026
          <br />
          Aplicación de Servicios Web | Integración con Auth0
        </Typography>
      </Box>
    </Box>
  )
}
