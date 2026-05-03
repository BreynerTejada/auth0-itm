import { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Button,
  Alert,
  Typography,
  CircularProgress,
} from '@mui/material'
import { Save as SaveIcon } from '@mui/icons-material'
import * as styles from '../theme/profileStyles'
import { getUserMetadata, updateUserMetadata } from '../utils/auth'
import LoadingSpinner from './LoadingSpinner'

const DOCUMENT_TYPES = [
  { value: 'CC', label: 'Cédula de Ciudadanía (CC)' },
  { value: 'CE', label: 'Cédula de Extranjería (CE)' },
  { value: 'PAS', label: 'Pasaporte (PAS)' },
  { value: 'TI', label: 'Tarjeta de Identidad (TI)' },
  { value: 'NIT', label: 'NIT' },
]

type FormData = {
  tipo_documento: string
  numero_documento: string
  direccion: string
  telefono: string
}

type FormErrors = Partial<Record<keyof FormData, string>>

export default function ProfileForm() {
  const [formData, setFormData] = useState<FormData>({
    tipo_documento: '',
    numero_documento: '',
    direccion: '',
    telefono: '',
  })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})

  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const data = await getUserMetadata()
        const metadata = data.user_metadata || {}
        setFormData({
          tipo_documento: metadata.tipo_documento || '',
          numero_documento: metadata.numero_documento || '',
          direccion: metadata.direccion || '',
          telefono: metadata.telefono || '',
        })
      } catch {
        setErrorMessage('Error al cargar los datos del perfil')
      } finally {
        setLoading(false)
      }
    }
    loadMetadata()
  }, [])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.tipo_documento.trim()) {
      newErrors.tipo_documento = 'Selecciona un tipo de documento'
    }
    if (!formData.numero_documento.trim()) {
      newErrors.numero_documento = 'El número de documento es requerido'
    } else if (formData.numero_documento.length < 5) {
      newErrors.numero_documento = 'El número debe tener al menos 5 caracteres'
    }
    if (!formData.direccion.trim()) {
      newErrors.direccion = 'La dirección es requerida'
    } else if (formData.direccion.length < 10) {
      newErrors.direccion = 'La dirección debe tener al menos 10 caracteres'
    }
    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es requerido'
    } else if (formData.telefono.length < 7) {
      newErrors.telefono = 'El teléfono debe tener al menos 7 dígitos'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
    setErrorMessage('')
    setSuccessMessage('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) {
      setErrorMessage('Por favor, completa todos los campos correctamente')
      return
    }
    setSubmitting(true)
    setErrorMessage('')
    setSuccessMessage('')
    try {
      await updateUserMetadata(formData)
      setSuccessMessage('Datos actualizados exitosamente')
      setTimeout(() => setSuccessMessage(''), 4000)
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { error?: string } } }
      setErrorMessage(axiosError.response?.data?.error || 'Error al actualizar los datos')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <LoadingSpinner message="Cargando formulario..." />
  }

  return (
    <Card sx={styles.formCard}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h5" sx={styles.formTitle}>
          Editar Perfil
        </Typography>
        <Typography variant="body2" sx={styles.formSubtitle}>
          Actualiza tu información personal en Auth0
        </Typography>

        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>
        )}
        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={styles.formContainer}>
          {/* Tipo de Documento */}
          <TextField
            select
            id="tipo_documento"
            name="tipo_documento"
            label="Tipo de Documento"
            value={formData.tipo_documento}
            onChange={handleChange}
            fullWidth
            required
            error={!!errors.tipo_documento}
            helperText={errors.tipo_documento || ' '}
            disabled={submitting}
          >
            {DOCUMENT_TYPES.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          {/* Número de Documento */}
          <TextField
            id="numero_documento"
            name="numero_documento"
            label="Número de Documento"
            value={formData.numero_documento}
            onChange={handleChange}
            fullWidth
            required
            placeholder="Ej: 1234567890"
            error={!!errors.numero_documento}
            helperText={errors.numero_documento || 'Sin espacios ni caracteres especiales'}
            disabled={submitting}
          />

          {/* Dirección */}
          <TextField
            id="direccion"
            name="direccion"
            label="Dirección"
            value={formData.direccion}
            onChange={handleChange}
            fullWidth
            required
            placeholder="Ej: Carrera 70 No. 53-50"
            error={!!errors.direccion}
            helperText={errors.direccion || 'Dirección completa'}
            disabled={submitting}
          />

          {/* Teléfono */}
          <TextField
            id="telefono"
            name="telefono"
            label="Teléfono"
            type="tel"
            value={formData.telefono}
            onChange={handleChange}
            fullWidth
            required
            placeholder="Ej: +57 300 1234567"
            error={!!errors.telefono}
            helperText={errors.telefono || 'Incluye código de país'}
            disabled={submitting}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
            disabled={submitting}
            sx={styles.submitButton}
          >
            {submitting ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </Box>

        <Box sx={styles.formNote}>
          <Typography variant="caption" sx={styles.formNoteText}>
            <strong>Nota:</strong> Los datos se almacenan en tu cuenta de Auth0 y persisten entre sesiones.
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}
