import { useEffect, useState } from 'react'
import { Box, Typography } from '@mui/material'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { Check } from 'lucide-react'
import { validateAndConsumeAccess } from '../utils/routeProtection'
import { useRegistration } from '../context/RegistrationContext'
import Leaderboard from '../components/Leaderboard'

export const Route = createFileRoute('/youwin')({
  beforeLoad: async () => {
    if (!validateAndConsumeAccess('/youwin')) {
      throw redirect({ to: '/' })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { 
    isRegistering, 
    username, 
    combo, 
    stopTimer, 
    addToLeaderboard, 
    setIsRegistering 
  } = useRegistration()


  useEffect(() => {
    if (isRegistering) {
      const time = stopTimer()
    }
  }, [isRegistering, username, combo, stopTimer, addToLeaderboard, setIsRegistering])

  if (isRegistering) {
    return (
      <Box sx={{ minHeight: '100vh', p: 4, pt: 10 }}>
        <Typography variant="h3" sx={{ textAlign: 'center', mb: 2, color: '#22c55e' }}>
          <Check size={48} style={{ verticalAlign: 'middle' }} /> Registration Complete!
        </Typography>
        <Typography variant="h6" sx={{ textAlign: 'center', mb: 4, opacity: 0.7 }}>
          You made it out of the Lost Woods, {username}!
        </Typography>
        <Leaderboard />
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Typography variant="h4">Congratulations you have signed in!</Typography>
    </Box>
  )
}
