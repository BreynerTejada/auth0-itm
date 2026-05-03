import { Button } from '@mui/material'
import { Login } from '@mui/icons-material'
import { useAuth0 } from '@auth0/auth0-react'
import * as styles from '../theme/componentStyles'

export default function LoginButton() {
  const { loginWithRedirect } = useAuth0()

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={() => loginWithRedirect()}
      startIcon={<Login />}
      sx={styles.loginButton}
    >
      Iniciar Sesión
    </Button>
  )
}
