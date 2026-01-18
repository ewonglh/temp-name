import { useState } from 'react'
import { TextField, Button, Stack } from '@mui/material'
import './slider.css'

interface SliderProps {
  value: string
  onChange: (value: string) => void
  label?: string
}

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

export default function Slider({ value, onChange, label }: SliderProps) {
  const [selectedLetter, setSelectedLetter] = useState(CHARS[0])

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value)
    setSelectedLetter(CHARS[val] || CHARS[0])
  }

  const handleAddLetter = () => {
    onChange(value + selectedLetter)
  }

  const handleClear = () => {
    onChange('')
  }

  const charIndex = CHARS.indexOf(selectedLetter)

  return (
    <Stack spacing={2} alignItems="center" className="slider-input-container">
      <TextField
        label={label}
        value={value}
        fullWidth
        variant="outlined"
        InputProps={{
          readOnly: true,
        }}
        onKeyDown={(e) => e.preventDefault()}
        onPaste={(e) => e.preventDefault()}
        onDrop={(e) => e.preventDefault()}
        sx={{
          '& .MuiInputBase-input': {
            fontFamily: 'monospace',
            fontSize: '1.5rem',
            textAlign: 'center',
            letterSpacing: '0.2em'
          }
        }}
      />
      
      <div className="flex flex-col items-center gap-4 p-8 bg-black/5 rounded-3xl backdrop-blur-sm border border-black/5 shadow-xl transition-all hover:bg-black/10 w-full">
        <div className="flex flex-col items-center gap-8 w-full">
          <div className="relative w-full flex items-center justify-center h-12 gap-4">
            <span className="text-gray-500 font-bold text-xl">{CHARS[0]}</span>
            <input
              type="range"
              min="0"
              max={CHARS.length - 1}
              step="1"
              value={charIndex === -1 ? 0 : charIndex}
              onChange={handleSliderChange}
              onKeyDown={(e) => e.preventDefault()}
              onPaste={(e) => e.preventDefault()}
              onDrop={(e) => e.preventDefault()}
              className="custom-slider"
              style={{
                width: '22px',
                height: '20px',
                // @ts-ignore - custom CSS property
                '--value-percent': `${((charIndex === -1 ? 0 : charIndex) / (CHARS.length - 1)) * 100}%`
              }}
            />
            <span className="text-gray-500 font-bold text-xl">{CHARS[CHARS.length - 1]}</span>
          </div>

          <Stack direction="row" spacing={2} flexWrap="wrap" justifyContent="center">
            <Button
              variant="contained"
              onClick={handleAddLetter}
              sx={{ bgcolor: 'white', color: 'black', '&:hover': { bgcolor: '#f0f0f0' }, borderRadius: 3, px: 4 }}
            >
              Enter '{selectedLetter === ' ' ? 'Space' : selectedLetter}'
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={handleClear}
              sx={{ borderRadius: 3 }}
            >
              Clear
            </Button>
          </Stack>
        </div>
      </div>
    </Stack>
  )
}
