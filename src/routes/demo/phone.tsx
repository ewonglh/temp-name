import { createFileRoute } from '@tanstack/react-router'
import { Box, Paper, Typography } from '@mui/material'
import PhoneInput from '../../components/PhoneInput'

export const Route = createFileRoute('/demo/phone')({
  component: PhoneDemo,
})

function PhoneDemo() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4,
      }}
    >
      <Typography variant="h4" sx={{ mb: 4 }}>
        Phone Input Demo
      </Typography>
      <Paper sx={{ width: '100%', maxWidth: '400px', p: 4, borderRadius: 2 }}>
        <PhoneInput label="Phone Number" />
      </Paper>
    </Box>
  )
}
