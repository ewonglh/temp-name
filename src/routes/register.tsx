import { createFileRoute } from '@tanstack/react-router'
import { Box, Typography } from '@mui/material'

export const Route = createFileRoute('/register')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography variant="h2" component="header">
        Hello "/register"!
      </Typography>
    </Box>
  )
}
