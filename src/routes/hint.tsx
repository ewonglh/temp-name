import { Button, Stack, TextField } from '@mui/material'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/hint')({
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
      <Button
        href = "/lostwoods"
      >
         maybe check three a little closer
      </Button>
    </Stack>
  )
}
