import { Button } from '@mui/material'
import { Logout } from '@mui/icons-material'
import { useAuth0 } from '@auth0/auth0-react'
import * as styles from '../theme/componentStyles'

export default function LogoutButton() {
  const { logout } = useAuth0()

  return (
    <Button
      variant="contained"
      color="error"
      onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
      startIcon={<Logout />}
      sx={styles.logoutButton}
    >
      Cerrar Sesión
    </Button>
  )
}
