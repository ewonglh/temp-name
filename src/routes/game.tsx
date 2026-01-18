import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import Slider from '../components/slider'

export const Route = createFileRoute('/game')({
  component: RouteComponent,
})

function RouteComponent() {
  const [selectedLetter, setSelectedLetter] = useState('A')
  const [password, setPassword] = useState('')

  const handleLetterChange = (letter: string) => {
    setSelectedLetter(letter)
  }

  const handleAddLetter = () => {
    setPassword(prev => prev + selectedLetter)
  }

  const handleSubmit = () => {
    alert(`Password Submitted: ${password}`)
    setPassword('')
  }

  const handleRefresh = () => {
    setPassword('')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-800 p-8">
      <div className="w-full max-w-lg flex flex-col items-center gap-12">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Password
          </h1>
        </div>

        {/* Password Display and Submit */}
        <div className="w-full flex items-center gap-3">
          <div className="flex-1 h-16 bg-gray-50 rounded-2xl border-2 border-gray-100 flex items-center px-6 overflow-hidden shadow-inner focus-within:border-blue-500 transition-colors">
            <span className={`text-2xl font-mono tracking-widest ${password ? 'text-gray-800' : 'text-gray-300'}`}>
              {password || "Start typing..."}
            </span>
          </div>

          <button
            onClick={handleRefresh}
            className="h-16 w-16 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-500 rounded-2xl flex items-center justify-center shadow-lg shadow-gray-200/50 transition-all hover:-translate-y-1 active:translate-y-0"
            aria-label="Refresh Password"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
          </button>

          <button
            onClick={handleSubmit}
            className="h-16 w-16 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-1 active:translate-y-0"
            aria-label="Submit Password"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>

        {/* Selected Letter Preview */}
        <div className="flex flex-col items-center">
          <div className="text-7xl font-black text-gray-900/5 select-none absolute scale-150 pointer-events-none blur-3xl">
            {selectedLetter}
          </div>
          <div className="relative text-6xl font-bold text-gray-800 drop-shadow-sm transition-all duration-150">
            {selectedLetter}
          </div>
        </div>

        <Slider
          onLetterChange={handleLetterChange}
          onLetterSelect={handleAddLetter}
        />
      </div>
    </div>
  )
}
