import { Link as RouterLink } from 'react-router-dom'
import {
  Box,
  Container,
  AppBar,
  Toolbar,
  Typography,
  Breadcrumbs,
  Link,
  Stack,
} from '@mui/material'
import * as styles from '../theme/profileStyles'
import LogoutButton from '../components/LogoutButton'
import ProfileForm from '../components/ProfileForm'

export default function Profile({ user }: { user: { email?: string } }) {
  return (
    <Box sx={styles.profileContainer}>
      {/* Header */}
      <AppBar position="static" sx={styles.profileHeader}>
        <Toolbar sx={styles.profileToolbar}>
          <Typography variant="h6" sx={styles.profileTitle}>
            👤 Editar Perfil
          </Typography>
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <Typography sx={{ fontSize: '14px' }}>{user?.email}</Typography>
            <LogoutButton />
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={styles.mainContent}>
        <Container maxWidth="md" sx={{ py: 4 }}>
          {/* Breadcrumb */}
          <Breadcrumbs sx={styles.breadcrumbs}>
            <Link component={RouterLink} to="/dashboard" underline="hover">
              Dashboard
            </Link>
            <Typography sx={{ color: 'text.primary' }}>Editar Perfil</Typography>
          </Breadcrumbs>

          {/* Profile Form */}
          <ProfileForm />

          {/* Help Section */}
          <Box sx={styles.helpSection}>
            <Typography variant="h6" sx={styles.helpTitle}>
              ℹ️ Ayuda
            </Typography>
            <Stack spacing={1}>
              <Typography variant="body2">
                • <strong>Tipo de Documento:</strong> Selecciona el tipo de documento de identificación
              </Typography>
              <Typography variant="body2">
                • <strong>Número de Documento:</strong> Ingresa tu número sin espacios ni caracteres especiales
              </Typography>
              <Typography variant="body2">
                • <strong>Dirección:</strong> Ingresa tu dirección completa
              </Typography>
              <Typography variant="body2">
                • <strong>Teléfono:</strong> Incluye código de país (ej: +57 300 1234567)
              </Typography>
              <Typography variant="body2" sx={styles.helpSuccess}>
                ✅ Los cambios se guardan automáticamente en Auth0 cuando presionas el botón "Guardar"
              </Typography>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box component="footer" sx={styles.footer}>
        <Typography variant="body2">
          Institución Universitaria Tecnológica Metropolitana (ITM) - 2026
        </Typography>
      </Box>
    </Box>
  )
}
