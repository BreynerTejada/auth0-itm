import { Button } from '@mui/material'
import { Login } from '@mui/icons-material'
import * as styles from '../theme/componentStyles'

const DJANGO_URL = import.meta.env.VITE_DJANGO_URL || 'http://localhost:8000'

export default function LoginButton() {
  return (
    <Button
      variant="contained"
      color="primary"
      href={`${DJANGO_URL}/auth0/login/`}
      startIcon={<Login />}
      sx={styles.loginButton}
    >
      Iniciar Sesión
    </Button>
  )
}
