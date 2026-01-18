import { Stack, Grid, Box } from '@mui/material';
import { createFileRoute, redirect } from '@tanstack/react-router'
import { validateAndConsumeAccess } from '../utils/routeProtection'
import ProtectedButton from '../components/ProtectedButton'

export const Route = createFileRoute('/zwei')({
  beforeLoad: async () => {
    if (!validateAndConsumeAccess('/zwei')) {
      throw redirect({ to: '/' })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
    
  return (
    <Stack>
        <Grid
        container
        spacing={0}
        sx={{   
            minHeight: "10vh",
            minWidth: "100vw",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor:"#f0f0f0"
        }}
        >
        
            <Grid size ={4} key={0}
            sx = {{
                height:120,
                padding:3,
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
                backgroundColor:"#f0f0f0"
            }}
            >
            <ProtectedButton
                variant="contained"
                targetPath="/lostwoods"
                sx={{
                    height: "100%"
                }}
            >
                1
            </ProtectedButton>
            </Grid>
                
            <Grid size ={4} key={1}
            sx = {{
                height:120,
                padding:3,
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
                backgroundColor:"#f0f0f0"
            }}
            >
            <ProtectedButton
                variant="contained"
                targetPath="/lostwoods"
                sx={{
                    height: "100%"
                }}
            >
                2
            </ProtectedButton>
            </Grid>

            <Grid size ={4} key={2}
            sx = {{
                height:120,
                padding:3,
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
                backgroundColor:"#f0f0f0"
            }}
            >
            <ProtectedButton
                variant="contained"
                targetPath="/lostwoods"
                sx={{
                    height: "100%"
                }}
            >
                3
            </ProtectedButton>
            </Grid>

            <Grid size ={4} key={3}
            sx = {{
                height:120,
                padding:3,
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
                backgroundColor:"#f0f0f0"
            }}
            >
            <ProtectedButton
                variant="contained"
                targetPath="/lostwoods"
                sx={{
                    height: "100%"
                }}
            >
                4
            </ProtectedButton>
            </Grid>

            <Grid size ={4} key={4}
            sx = {{
                height:120,
                padding:3,
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
                backgroundColor:"#f0f0f0"
            }}
            >
            <ProtectedButton
                variant="contained"
                targetPath="/lostwoods"
                sx={{
                    height: "100%"
                }}
            >
                5
            </ProtectedButton>
            </Grid>

        

        <Grid size ={4} key={5}
            sx = {{
                height:120,
                padding:3,
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
                backgroundColor:"#f0f0f0"
            }}
            >
            <ProtectedButton
                variant="contained"
                targetPath="/lostwoods"
                sx={{
                    height: "100%"
                }}
            >
                6
            </ProtectedButton>
            </Grid>

            <Grid size ={4} key={6}
            sx = {{
                height:120,
                padding:3,
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
                backgroundColor:"#f0f0f0"
            }}
            >
            <ProtectedButton
                targetPath="/tres"
                variant="contained"
                sx={{
                    height: "100%"
                }}
            >
                7
            </ProtectedButton>
            </Grid>

            <Grid size ={4} key={7}
            sx = {{
                height:120,
                padding:3,
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
                backgroundColor:"#f0f0f0"
            }}
            >
            <ProtectedButton
                variant="contained"
                targetPath="/lostwoods"
                sx={{
                    height: "100%"
                }}
            >
                8
            </ProtectedButton>
            </Grid>

            <Grid size ={4} key={8}
            sx = {{
                height:120,
                padding:3,
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
                backgroundColor:"#f0f0f0"
            }}
            >
            <ProtectedButton
            
                variant="contained"
                targetPath="/lostwoods"
                sx={{
                    height: "100%"
                }}
            >
                9
            </ProtectedButton>
            </Grid>

            
        </Grid>
        
        <Box sx = {{
            flexGrow:1,
            minHeight: "1500px",
            backgroundColor:"#f0f0f0"
        }}>
            
        </Box>
        
        



    </Stack>
  );
}

