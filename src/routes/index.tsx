import { createFileRoute } from '@tanstack/react-router'
import Typewriter from 'typewriter-effect'
import RhythmPin from '../components/RhythmPin'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {

  return (
    <div className="text-center min-h-screen bg-[#282c34] text-white flex flex-col items-center justify-center p-4">
      <header className="mb-8 text-[calc(10px+2vmin)]">
        <Typewriter options={{
          strings: ["enter your pin if you can"],
          autoStart: true,
          loop: true,
          delay: 50
        }}/>
      </header>
      
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">
        <h2 className="text-xl mb-6 text-gray-300 font-light">Security Check</h2>
        <RhythmPin 
          label="Enter 6-digit PIN" 
          variant="outlined" 
          fullWidth
        />
      </div>
    </div>
  )
}
