import { createFileRoute, redirect } from '@tanstack/react-router'
import { validateAndConsumeAccess } from '../utils/routeProtection'
import ProtectedButton from '../components/ProtectedButton'

export const Route = createFileRoute('/vid')({
  beforeLoad: async () => {
    if (!validateAndConsumeAccess('/vid')) {
      throw redirect({ to: '/' })
    }
  },
  component: App,
})

import video from '/vid.mp4'

function App(){
    return (
      <>
      <ProtectedButton
        variant="contained"
        targetPath="/lostwoods"
        sx={{
            height: "100%"
        }}
      > Back
      </ProtectedButton>
      <video style={{width:"50vw", height:"50vh", margin:"auto", display:"flex", justifyContent:"center", alignItems:"center"}} controls autoPlay >
      <source src={video} type="video/mp4"/>
      </video>
      </>
    );   
}

export default App;
