import { useState } from 'react'
import { Button } from '@mui/material'
import Slider from './slider'

interface SliderPasswordGameProps {
  title?: string;
  placeholder?: string;
  onSubmit?: (password: string) => void;
}

function SliderPasswordGame({
  title = "Security Verification",
  placeholder = "Constructed Password",
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
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-blue-600">
            {title}
          </h1>
          <p className="text-gray-500 text-sm">
            Drag the slider to build your password one character at a time.
          </p>
        </div>

        <Slider
          value={password}
          onChange={setPassword}
          label="Build Password"
          placeholder={placeholder}
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
