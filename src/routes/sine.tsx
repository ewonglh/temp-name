import { Box } from '@mui/material';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/sine')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Box
  component="img"
  sx={{
    height: 233,
    width: 350,
    maxHeight: { xs: 233, md: 167 },
    maxWidth: { xs: 350, md: 250 },
    alignItems: "center",
    justifyContent: "center",
    display: "flex"
  }}
  alt="The house from the offer."
  src="benzene.png"
/>
  );
}
