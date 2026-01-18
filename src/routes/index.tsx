import { createFileRoute, Link } from '@tanstack/react-router'
import Typewriter from 'typewriter-effect'
import { Box, Button, Typography } from '@mui/material'
import { UserPlus } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="text-center">
      <header className="min-h-screen flex flex-col items-center justify-center bg-[#282c34] text-white text-[calc(10px+2vmin)]">
        <Typewriter options={{
          strings: ["most frustrating login page ever"],
          autoStart: true,
          loop: true
        }} />
      </header>
    </div>
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
      <Box sx={{ mb: 4 }}>
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
      
      <Button
        component={Link}
        to="/register"
        variant="contained"
        size="large"
        startIcon={<UserPlus />}
        sx={{
          px: 6,
          py: 2,
          fontSize: '1.2rem',
          fontWeight: 'bold',
          borderRadius: 3,
          background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
          boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4)',
          '&:hover': {
            background: 'linear-gradient(45deg, #764ba2 30%, #667eea 90%)',
            transform: 'translateY(-2px)',
            boxShadow: '0 12px 40px rgba(102, 126, 234, 0.6)',
          },
          transition: 'all 0.3s ease',
        }}
      >
        Register Now
      </Button>
      
      <Typography variant="body2" sx={{ mt: 2, opacity: 0.6 }}>
        Can you survive the Input Hell?
      </Typography>
    </Box>
  )
}
