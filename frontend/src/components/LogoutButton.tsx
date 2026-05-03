import { Button } from '@mui/material'
import { Logout } from '@mui/icons-material'
import * as styles from '../theme/componentStyles'

const DJANGO_URL = import.meta.env.VITE_DJANGO_URL || 'http://localhost:8000'

export default function LogoutButton() {
  return (
    <Button
      variant="contained"
      color="error"
      href={`${DJANGO_URL}/auth0/logout/`}
      startIcon={<Logout />}
      sx={styles.logoutButton}
    >
      Cerrar Sesión
    </Button>
  )
}
