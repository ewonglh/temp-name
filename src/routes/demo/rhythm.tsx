import { createFileRoute } from '@tanstack/react-router'
import { Box, Paper, Typography } from '@mui/material'
import RhythmPin from '../../components/RhythmPin'

export const Route = createFileRoute('/demo/rhythm')({
  component: RhythmDemo,
})

function RhythmDemo() {
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
        Rhythm PIN Demo
      </Typography>
      <Paper
        sx={{
          width: '100%',
          maxWidth: '400px',
          p: 4,
          borderRadius: 2,
          textAlign: 'center',
        }}
      >
        <RhythmPin label="Enter PIN" />
      </Paper>
    </Box>
  )
}
