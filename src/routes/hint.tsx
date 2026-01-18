import { Button, Stack } from '@mui/material'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { validateAndConsumeAccess } from '../utils/routeProtection'
import ProtectedButton from '../components/ProtectedButton'

export const Route = createFileRoute('/hint')({
  beforeLoad: async () => {
    if (!validateAndConsumeAccess('/hint')) {
      throw redirect({ to: '/' })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Stack spacing={3} width={300}
        sx = {{
          display: "flex",
          position: "relative",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100wh"
        }}
    >
      <ProtectedButton
        targetPath="/lostwoods"
      >
         maybe check three a little closer
      </ProtectedButton>
    </Stack>
  )
}
