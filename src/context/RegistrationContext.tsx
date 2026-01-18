import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { loadUserData } from '../data/Data'

interface LeaderboardEntry {
  username: string
  time: number // in seconds
  combo: number
}

interface RegistrationState {
  // Timer
  timerRunning: boolean
  startTime: number | null
  elapsed: number
  
  // Registration data
  username: string
  phone: string
  securityQ1: string
  securityA1: string
  securityQ2: string
  securityA2: string
  combo: number
  
  // Leaderboard
  leaderboard: LeaderboardEntry[]
}

interface RegistrationContextType extends RegistrationState {
  startTimer: () => void
  stopTimer: () => number
  setUsername: (name: string) => void
  setPhone: (phone: string) => void
  setSecurityQ1: (q: string) => void
  setSecurityA1: (a: string) => void
  setSecurityQ2: (q: string) => void
  setSecurityA2: (a: string) => void
  setCombo: (combo: number) => void
  addToLeaderboard: (entry: LeaderboardEntry) => void
  resetRegistration: () => void
}

const initialState: RegistrationState = {
  timerRunning: false,
  startTime: null,
  elapsed: 0,
  username: '',
  phone: '',
  securityQ1: '',
  securityA1: '',
  securityQ2: '',
  securityA2: '',
  combo: 0,
  leaderboard: []
}

const RegistrationContext = createContext<RegistrationContextType | null>(null)

export function RegistrationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<RegistrationState>(initialState)

  // Load leaderboard data on mount
  useEffect(() => {
    loadUserData().then(data => {
      setState(prev => ({ ...prev, leaderboard: data }))
    })
  }, [])

  // Timer effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null
    if (state.timerRunning && state.startTime) {
      interval = setInterval(() => {
        setState(prev => ({
          ...prev,
          elapsed: Math.floor((Date.now() - (prev.startTime || 0)) / 1000)
        }))
      }, 100)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [state.timerRunning, state.startTime])

  const startTimer = useCallback(() => {
    setState(prev => ({
      ...prev,
      timerRunning: true,
      startTime: Date.now(),
      elapsed: 0
    }))
  }, [])

  const stopTimer = useCallback(() => {
    const finalTime = state.startTime ? Math.floor((Date.now() - state.startTime) / 1000) : 0
    setState(prev => ({
      ...prev,
      timerRunning: false,
      elapsed: finalTime
    }))
    return finalTime
  }, [state.startTime])

  const setUsername = useCallback((username: string) => {
    setState(prev => ({ ...prev, username }))
  }, [])

  const setPhone = useCallback((phone: string) => {
    setState(prev => ({ ...prev, phone }))
  }, [])

  const setSecurityQ1 = useCallback((securityQ1: string) => {
    setState(prev => ({ ...prev, securityQ1 }))
  }, [])

  const setSecurityA1 = useCallback((securityA1: string) => {
    setState(prev => ({ ...prev, securityA1 }))
  }, [])

  const setSecurityQ2 = useCallback((securityQ2: string) => {
    setState(prev => ({ ...prev, securityQ2 }))
  }, [])

  const setSecurityA2 = useCallback((securityA2: string) => {
    setState(prev => ({ ...prev, securityA2 }))
  }, [])

  const setCombo = useCallback((combo: number) => {
    setState(prev => ({ ...prev, combo }))
  }, [])

  const addToLeaderboard = useCallback((entry: LeaderboardEntry) => {
    setState(prev => ({
      ...prev,
      leaderboard: [...prev.leaderboard, entry].sort((a, b) => a.time - b.time)
    }))
  }, [])

  const resetRegistration = useCallback(() => {
    setState(prev => ({
      ...initialState,
      leaderboard: prev.leaderboard // Keep leaderboard
    }))
  }, [])

  return (
    <RegistrationContext.Provider value={{
      ...state,
      startTimer,
      stopTimer,
      setUsername,
      setPhone,
      setSecurityQ1,
      setSecurityA1,
      setSecurityQ2,
      setSecurityA2,
      setCombo,
      addToLeaderboard,
      resetRegistration,
    }}>
      {children}
    </RegistrationContext.Provider>
  )
}

export function useRegistration() {
  const context = useContext(RegistrationContext)
  if (!context) {
    throw new Error('useRegistration must be used within a RegistrationProvider')
  }
  return context
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}
