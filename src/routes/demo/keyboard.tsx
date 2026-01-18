import { createFileRoute } from '@tanstack/react-router'
import { Box, Paper, Typography } from '@mui/material'
import TextFieldWithKeyboard from '../../components/TextFieldWithKeyboard'

export const Route = createFileRoute('/demo/keyboard')({
  component: KeyboardDemo,
})

function KeyboardDemo() {
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
        Virtual Keyboard Demo
      </Typography>
      <Paper
        sx={{
          width: '100%',
          maxWidth: '400px',
          p: 4,
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        <TextFieldWithKeyboard label="Type here..." />
      </Paper>
    </Box>
  )
}
