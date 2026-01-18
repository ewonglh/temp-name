import { useState } from 'react'
import { Button } from '@mui/material'
import Slider from './slider'

interface SliderPasswordGameProps {
  title?: string;
  placeholder?: string;
  onSubmit?: (password: string) => void;
}

function SliderPasswordGame({
  title = "Password",
  onSubmit
}: SliderPasswordGameProps) {
  const [password, setPassword] = useState('')

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(password);
    } else {
      alert(`Password Submitted: ${password}`);
    }
    setPassword('');
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-800 p-8">
      <div className="w-full max-w-lg flex flex-col items-center gap-12">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            {title}
          </h1>
        </div>

        <Slider
          value={password}
          onChange={setPassword}
          label="Build Password"
        />

        <Button 
          variant="contained" 
          color="primary" 
          size="large"
          onClick={handleSubmit}
          sx={{ borderRadius: 3, height: 56, minWidth: 200 }}
        >
          Submit Password
        </Button>
      </div>
    </div>
  )
}

export default SliderPasswordGame;
