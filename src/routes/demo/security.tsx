import { createFileRoute } from '@tanstack/react-router'
import { Box, Paper } from '@mui/material'
import SecurityQuestions from '../../components/SecurityQuestions'

export const Route = createFileRoute('/demo/security')({
  component: SecurityDemo,
})

function SecurityDemo() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '100px', // Leave space for header
        p: 4,
        overflow: 'hidden'
      }}
    >
      <Paper
        sx={{
          width: '100%',
          maxWidth: '800px',
          p: 0,
          borderRadius: 2,
          overflow: 'hidden',
          bgcolor: 'background.paper',
          position: 'relative',
          zIndex: 1
        }}
      >
        <SecurityQuestions />
      </Paper>
    </Box>
  )
}
