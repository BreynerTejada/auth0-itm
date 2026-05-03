import { useEffect, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  Box,
  Container,
  AppBar,
  Toolbar,
  Typography,
  Card,
  CardContent,
  CardActions,
  Grid,
  Button,
  Alert,
  Avatar,
  Stack,
  Chip,
} from '@mui/material'
import { getUserProfile } from '../utils/auth'
import * as styles from '../theme/dashboardStyles'
import LogoutButton from '../components/LogoutButton'
import LoadingSpinner from '../components/LoadingSpinner'

const DJANGO_URL = import.meta.env.VITE_DJANGO_URL || 'http://localhost:8000'

export default function Dashboard({ user }: { user: { email?: string } }) {
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getUserProfile()
        setProfile(data)
      } catch {
        setError('Error al cargar el perfil')
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [])

  if (loading) {
    return (
      <>
        <AppBar position="static" sx={styles.dashboardHeader}>
          <Toolbar sx={styles.dashboardToolbar}>
            <Typography variant="h6" sx={styles.dashboardTitle}>Dashboard</Typography>
            <LogoutButton />
          </Toolbar>
        </AppBar>
        <Box sx={styles.mainContent}>
          <LoadingSpinner message="Cargando tu perfil..." />
        </Box>
      </>
    )
  }

  const metadata = (profile?.user_metadata as Record<string, string>) || {}
  const hasMetadata = Object.values(metadata).some(v => v)

  const metadataFields = [
    { label: 'Tipo Documento', key: 'tipo_documento' },
    { label: 'Número Documento', key: 'numero_documento' },
    { label: 'Dirección', key: 'direccion' },
    { label: 'Teléfono', key: 'telefono' },
  ]

  return (
    <Box sx={styles.dashboardContainer}>
      <AppBar position="static" sx={styles.dashboardHeader}>
        <Toolbar sx={styles.dashboardToolbar}>
          <Typography variant="h6" sx={styles.dashboardTitle}>Dashboard</Typography>
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <Typography sx={{ fontSize: '14px' }}>{user?.email}</Typography>
            <LogoutButton />
          </Stack>
        </Toolbar>
      </AppBar>

      <Box sx={styles.mainContent}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          {profile && (
            <>
              {/* Profile Header Card */}
              <Card sx={styles.profileHeader}>
                <CardContent sx={styles.profileCard}>
                  <Avatar
                    src={profile.picture as string}
                    sx={styles.profileAvatar}
                  />
                  <Box sx={styles.profileInfo}>
                    <Typography variant="h5" sx={styles.profileName}>
                      {(profile.name as string) || (profile.email as string)}
                    </Typography>
                    <Typography variant="body1" sx={styles.profileEmail}>
                      {profile.email as string}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              <Grid container spacing={3}>
                {/* Account Info */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Card sx={styles.infoBox}>
                    <CardContent>
                      <Typography variant="h6" sx={styles.cardTitle}>
                        Información de Cuenta
                      </Typography>
                      <Stack spacing={1.5}>
                        <Box>
                          <Typography variant="caption" sx={styles.infoLabel}>Email</Typography>
                          <Typography variant="body2">{profile.email as string}</Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Personal Data */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Card sx={styles.infoBox}>
                    <CardContent>
                      <Typography variant="h6" sx={styles.cardTitle}>
                        Datos Personales
                      </Typography>
                      {hasMetadata ? (
                        <Stack spacing={1.5}>
                          {metadataFields.map(({ label, key }) => (
                            <Box key={key}>
                              <Typography variant="caption" sx={styles.infoLabel}>{label}</Typography>
                              <Typography variant="body2">{metadata[key] || '—'}</Typography>
                            </Box>
                          ))}
                        </Stack>
                      ) : (
                        <Typography sx={styles.emptyState}>
                          No hay datos personales configurados aún.
                        </Typography>
                      )}
                    </CardContent>
                    <CardActions sx={styles.cardActions}>
                      <Button component={RouterLink} to="/profile" size="small" variant="outlined">
                        Editar Datos
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>

                {/* Security */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Card sx={styles.infoBox}>
                    <CardContent>
                      <Typography variant="h6" sx={styles.cardTitle}>
                        Seguridad
                      </Typography>
                      <Stack spacing={1.5}>
                        <Box>
                          <Typography variant="caption" sx={styles.infoLabel}>Proveedor</Typography>
                          <Typography variant="body2">Auth0</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="caption" sx={styles.infoLabel}>Estado</Typography>
                          <Chip label="Activo" size="small" color="success" sx={styles.statusChip} />
                        </Box>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          Tu cuenta está protegida por Auth0.
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Actions */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Card sx={styles.infoBox}>
                    <CardContent>
                      <Typography variant="h6" sx={styles.cardTitle}>
                        Acciones
                      </Typography>
                      <Stack spacing={1.5}>
                        <Button
                          component={RouterLink}
                          to="/profile"
                          variant="contained"
                          sx={styles.actionButton}
                          fullWidth
                        >
                          Editar Perfil
                        </Button>
                        <Button
                          href={`${DJANGO_URL}/auth0/logout/`}
                          variant="outlined"
                          color="error"
                          sx={styles.actionButton}
                          fullWidth
                        >
                          Cerrar Sesión
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Card sx={styles.infoSection}>
                <CardContent>
                  <Typography variant="h6" sx={styles.infoTitle}>
                    Sobre Esta Aplicación
                  </Typography>
                  <Typography variant="body2" sx={styles.infoText}>
                    Esta aplicación fue desarrollada como parte del taller evaluativo de "Aplicaciones
                    y Servicios Web". Demuestra integración con Auth0 para autenticación segura y
                    gestión de datos de usuario.
                  </Typography>
                </CardContent>
              </Card>
            </>
          )}
        </Container>
      </Box>

      <Box component="footer" sx={styles.footer}>
        <Typography variant="body2">
          Institución Universitaria Tecnológica Metropolitana (ITM) — 2026
        </Typography>
      </Box>
    </Box>
  )
}
