import { Box, CircularProgress, Typography } from '@mui/material'
import * as styles from '../theme/componentStyles'

export default function LoadingSpinner({ message = 'Cargando...' }: { message?: string }) {
  return (
    <Box sx={styles.spinnerContainer}>
      <CircularProgress size={60} />
      <Typography variant="h6" color="textSecondary">
        {message}
      </Typography>
    </Box>
  )
}
