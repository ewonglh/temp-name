import { Stack, Grid, Button, Box, TextField } from '@mui/material';
import { createFileRoute } from '@tanstack/react-router'


export const Route = createFileRoute('/liu')({
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
            <Button
            
                variant="contained"
                href="/lostwoods"
                sx={{
                    height: "100%"
                }}
            >
                1
            </Button>
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
            <Button
            
                variant="contained"
                href="/lostwoods"
                sx={{
                    height: "100%"
                }}
            >
                2
            </Button>
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
            <Button
            
                variant="contained"
                href="/lostwoods"
                sx={{
                    height: "100%"
                }}
            >
                3
            </Button>
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
            <Button
            
                variant="contained"
                href="/lostwoods"
                sx={{
                    height: "100%"
                }}
            >
                4
            </Button>
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
            <Button
            
                variant="contained"
                href="/lostwoods"
                sx={{
                    height: "100%"
                }}
            >
                5
            </Button>
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
            <Button
            
                variant="contained"
                href="/lostwoods"
                sx={{
                    height: "100%"
                }}
            >
                6
            </Button>
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
            <Button
            
                variant="contained"
                href="/lostwoods"
                sx={{
                    height: "100%"
                }}
            >
                7
            </Button>
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
            <Button
            
                variant="contained"
                href="/lostwoods"
                sx={{
                    height: "100%"
                }}
            >
                8
            </Button>
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
            <Button
            
                variant="contained"
                href="/hint"
                sx={{
                    height: "100%"
                }}
            >
                9
            </Button>
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

