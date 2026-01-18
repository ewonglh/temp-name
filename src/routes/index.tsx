import { createFileRoute } from '@tanstack/react-router'
import Typewriter from 'typewriter-effect'
import { Box, Typography } from '@mui/material'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <Box
      sx={{
        textAlign: 'center',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4,
      }}
    >
      <Box sx={{ mb: 8 }}>
        <Typography
          variant="h2"
          component="header"
          sx={{ fontSize: 'calc(10px + 2vmin)' }}
        >
          <Typewriter
            options={{
              strings: [
                'the best input methods',
                'obnoxious',
                'unnecessary',
                'overkill',
              ],
              autoStart: true,
              loop: true,
              delay: 50,
            }}
          />
        </Typography>
      </Box>
    </Box>
  )
}
