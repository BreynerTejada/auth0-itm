export const dashboardContainer = {
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
}

export const dashboardHeader = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
}

export const dashboardToolbar = {
  display: 'flex',
  justifyContent: 'space-between',
}

export const dashboardTitle = {
  fontWeight: 700,
  fontSize: '20px',
}

export const mainContent = {
  flex: 1,
}

export const profileHeader = {
  mb: 3,
}

export const profileCard = {
  display: 'flex',
  gap: 3,
  alignItems: 'center',
}

export const profileAvatar = {
  width: 80,
  height: 80,
}

export const profileInfo = {
  display: 'flex',
  flexDirection: 'column',
  gap: 0.5,
}

export const profileName = {
  fontWeight: 700,
}

export const profileEmail = {
  color: 'text.secondary',
}

export const infoBox = {
  height: '100%',
}

export const cardTitle = {
  fontWeight: 700,
  mb: 2,
}

export const infoStack = {
  spacing: 1.5,
}

// Use as: <Typography variant="caption" sx={styles.infoLabel}>
export const infoLabel = {
  color: 'text.secondary',
  display: 'block',
  mb: 0.25,
}

export const subCode = {
  bgcolor: '#f0f0f0',
  p: 0.75,
  borderRadius: 0.5,
  display: 'block',
  wordBreak: 'break-all',
  fontSize: '11px',
  fontFamily: 'monospace',
  mt: 0.25,
}

export const emptyState = {
  color: 'text.disabled',
  fontStyle: 'italic',
}

export const cardActions = {
  mt: 1,
  px: 2,
  pb: 2,
}

// Use size and color as props directly on Chip, not via sx
export const statusChip = {
  fontWeight: 600,
}

export const actionButtons = {
  spacing: 1.5,
}

export const actionButton = {
  textTransform: 'none',
}

export const infoSection = {
  mt: 3,
  bgcolor: '#f8f9ff',
  borderLeft: '4px solid #667eea',
  borderRadius: '4px',
}

export const infoTitle = {
  fontWeight: 700,
  mb: 1,
}

export const infoText = {
  color: 'text.secondary',
  lineHeight: 1.6,
}

export const footer = {
  bgcolor: '#2d2d2d',
  color: 'rgba(255,255,255,0.7)',
  textAlign: 'center',
  py: 2,
  fontSize: '13px',
}
