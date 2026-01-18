import { useState } from 'react'
import './slider.css'

interface SliderProps {
  onLetterChange: (letter: string) => void
  onLetterSelect?: () => void
}

export default function Slider({ onLetterChange, onLetterSelect }: SliderProps) {
  const [selectedLetter, setSelectedLetter] = useState('A')

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value)
    const letter = String.fromCharCode(65 + value) // 65 is ASCII for 'A'
    setSelectedLetter(letter)
    onLetterChange(letter)
  }

  return (
    <div className="flex flex-col items-center gap-8 p-12 bg-black/5 rounded-3xl backdrop-blur-sm border border-black/5 shadow-2xl transition-all hover:bg-black/10">
      <div className="w-[200px] flex flex-col items-center gap-16">
        <div className="relative w-full flex items-center justify-center h-12 gap-4">
          <span className="text-gray-500 font-bold text-xl">A</span>
          <input
            type="range"
            min="0"
            max="25"
            step="1"
            value={selectedLetter.charCodeAt(0) - 65}
            onChange={handleSliderChange}
            className="custom-slider"
            style={{
              width: '3%',
              height: '10px',
              // @ts-ignore - custom CSS property
              '--value-percent': `${((selectedLetter.charCodeAt(0) - 65) / 25) * 100}%`
            }}
          />
          <span className="text-gray-500 font-bold text-xl">Z</span>
        </div>

        <button
          onClick={onLetterSelect}
          className="px-6 py-2 bg-white/80 hover:bg-white text-gray-900 rounded-xl font-bold shadow-sm transition-all active:scale-95 flex items-center gap-2"
        >
          <span>Enter '{selectedLetter}'</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-gray-500">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  )
}
