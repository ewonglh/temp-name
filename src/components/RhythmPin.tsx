import { useEffect, useRef, useState } from 'react'
import { Box, TextField, Typography } from '@mui/material'
import { Delete } from 'lucide-react'
import type { TextFieldProps } from '@mui/material'
import './RhythmPin.css'

interface Note {
  id: number
  value: number | 'backspace'
  y: number
  laneIndex: number // 0-9
  speed: number
  hit: boolean
}

type RhythmPinProps = Omit<TextFieldProps, 'value' | 'onChange'> & {
  onPinChange?: (value: string) => void
  targetPin?: string
  onComplete?: (success: boolean, combo: number) => void
}

export default function RhythmPin({
  onPinChange,
  targetPin,
  onComplete,
  ...textFieldProps
}: RhythmPinProps) {
  const [pin, setPin] = useState('')
  const [gameActive, setGameActive] = useState(false)
  const [notes, setNotes] = useState<Array<Note>>([])
  const [feedback, setFeedback] = useState<
    Record<string, 'hit' | 'miss' | null>
  >({})
  const [combo, setCombo] = useState(0)
  const [maxCombo, setMaxCombo] = useState(0)

  // Game loop refs
  const requestRef = useRef<number | undefined>(undefined)
  const lastTimeRef = useRef<number | undefined>(undefined)
  const notesRef = useRef<Array<Note>>([])
  const gameContainerRef = useRef<HTMLDivElement>(null)

  // Lane configuration
  const lanes: Array<number | 'backspace'> = [
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    'backspace',
  ]
  const SPAWN_RATE = 500 // ms
  const BASE_SPEED = 0.2 // px per ms
  const HIT_Y_THRESHOLD = 250 // Target Y position (approximate, based on CSS container height)
  const HIT_WINDOW = 40 // +/- pixels

  const lastSpawnTime = useRef<number>(0)

  // Track max combo
  useEffect(() => {
    if (combo > maxCombo) {
      setMaxCombo(combo)
    }
  }, [combo, maxCombo])

  useEffect(() => {
    if (onPinChange) {
      onPinChange(pin)
    }
    // Check if PIN matches target
    if (targetPin && pin === targetPin && onComplete) {
      onComplete(true, maxCombo)
    }
  }, [pin, onPinChange, targetPin, onComplete, maxCombo])

  const spawnNote = (time: number) => {
    if (time - lastSpawnTime.current > SPAWN_RATE) {
      const laneIndex = Math.floor(Math.random() * 11)
      const newNote: Note = {
        id: time, // simple ID based on spawn time
        value: lanes[laneIndex],
        y: -50, // Start above view
        laneIndex,
        speed: BASE_SPEED + Math.random() * 0.1, // Slight speed variation
        hit: false,
      }
      notesRef.current.push(newNote)
      lastSpawnTime.current = time
    }
  }

  const updateGame = (time: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = time
    const deltaTime = time - lastTimeRef.current
    lastTimeRef.current = time

    // Move notes
    notesRef.current = notesRef.current.filter((note) => {
      note.y += note.speed * deltaTime
      // Remove notes that go off screen
      return note.y < 350
    })

    spawnNote(time)

    // React state update for rendering
    setNotes([...notesRef.current])

    requestRef.current = requestAnimationFrame(updateGame)
  }

  const startGame = () => {
    setGameActive(true)
    setCombo(0)
    lastTimeRef.current = undefined
    notesRef.current = []
    setNotes([])
    requestRef.current = requestAnimationFrame(updateGame)
  }

  const stopGame = () => {
    setGameActive(false)
    if (requestRef.current) cancelAnimationFrame(requestRef.current)
  }

  const handleTargetClick = (
    targetValue: number | 'backspace',
    e: React.MouseEvent | React.TouchEvent,
  ) => {
    e.preventDefault() // Prevent focus loss if possible

    // Find a note in the simplified collision window
    // We need to know the height of the container to know exactly where 'bottom' is in pixels relative to note 'y'
    // For now, let's assume the target is at HIT_Y_THRESHOLD approx.

    const hitNoteIndex = notesRef.current.findIndex(
      (n) =>
        n.value === targetValue &&
        Math.abs(n.y - HIT_Y_THRESHOLD) < HIT_WINDOW &&
        !n.hit,
    )

    if (hitNoteIndex !== -1) {
      // HIT
      const note = notesRef.current[hitNoteIndex]
      note.hit = true
      // Remove hit note immediately or animate it out?
      // For now, remove it to prevent double tapping
      notesRef.current.splice(hitNoteIndex, 1)
      setNotes([...notesRef.current])
      setCombo((prev) => prev + 1)

      triggerFeedback(targetValue, 'hit')
      if (targetValue === 'backspace') {
        setPin((prev) => prev.slice(0, -1))
      } else if (pin.length < 6) {
        setPin((prev) => prev + targetValue)
      }
    } else {
      // MISS
      setCombo(0)
      triggerFeedback(targetValue, 'miss')
    }
  }

  const triggerFeedback = (num: number | 'backspace', type: 'hit' | 'miss') => {
    setFeedback((prev) => ({ ...prev, [num]: type }))
    setTimeout(() => {
      setFeedback((prev) => ({ ...prev, [num]: null }))
    }, 300)
  }

  useEffect(() => {
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current)
      document.body.style.paddingBottom = ''
    }
  }, [])

  useEffect(() => {
    if (gameActive && gameContainerRef.current) {
      const height = gameContainerRef.current.offsetHeight
      document.body.style.paddingBottom = `${height}px`
      // Scroll to input to ensure it is visible?
      // Might not be needed if fixed to bottom 30vh is small enough
    } else {
      document.body.style.paddingBottom = ''
    }
  }, [gameActive])

  // Prevent keyboard input
  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.preventDefault()
  }

  return (
    <Box className="rhythm-pin-container">
      <TextField
        {...textFieldProps}
        value={pin}
        onFocus={startGame}
        onBlur={(e) => {
          // Slight delay to allow clicks on targets to register
          // But if we use onMouseDown on targets, it might fire before blur
          // Let's rely on the fact that game overlays might need to prevent default on mouseDown
          if (!e.currentTarget.contains(e.relatedTarget)) {
            stopGame()
          }
        }}
        onKeyDown={handleKeyDown}
        className="dark-mode-text-field hidden-caret"
        inputProps={{
          readOnly: true, // Also blocks mobile keyboard usually
          inputMode: 'none', // Hints browsers not to show virtual keyboard
        }}
        sx={{
          '& .MuiInputBase-input': {
            color: 'white',
            textAlign: 'center',
            letterSpacing: '0.5em',
            fontSize: '1.5rem',
          },
        }}
      />

      {gameActive && (
        <Box
          className="rhythm-game-overlay"
          ref={gameContainerRef}
          onMouseDown={(e) => e.preventDefault()}
        >
          <Box className="captcha-header">
            <Typography variant="body2" sx={{ color: 'white' }}>
              Verify you are not a robot
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, opacity: 0.8 }}>
               <Typography variant="caption" sx={{ fontSize: '10px' }}>SEC_ID: {Math.random().toString(36).substring(7).toUpperCase()}</Typography>
            </Box>
          </Box>
          {combo > 0 && (
            <Box key={combo} className="rhythm-combo-display">
              <Typography component="span" className="combo-text">
                COMBO:
              </Typography>
              <Typography component="span" className="combo-count">
                {combo}
              </Typography>
            </Box>
          )}
          <Box className="rhythm-lane-container">
            {lanes.map((num) => (
              <Box
                key={num}
                className={`rhythm-target-btn ${feedback[num] || ''}`}
                onMouseDown={(e) => handleTargetClick(num, e)}
                onTouchStart={(e) => handleTargetClick(num, e)}
              >
                {num === 'backspace' ? <Delete size={20} /> : num}
              </Box>
            ))}

            {notes.map((note) => {
              const laneWidth = 100 / 11
              const leftPercent = note.laneIndex * laneWidth + laneWidth / 2

              return (
                <Box
                  key={note.id}
                  className={`rhythm-note ${note.value === 'backspace' ? 'backspace-note' : ''}`}
                  sx={{
                    top: `${note.y}px`,
                    left: `${leftPercent}%`,
                    transform: 'translateX(-50%) rotate(10deg) skewX(5deg)',
                    backgroundColor:
                      note.value === 'backspace' ? 'error.main' : undefined,
                  }}
                >
                  {note.value === 'backspace' ? (
                    <Delete size={16} />
                  ) : (
                    note.value
                  )}
                </Box>
              )
            })}
          </Box>

          <Box sx={{ 
            position: 'absolute', 
            bottom: 10, 
            right: 10, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            opacity: 0.5
          }}>
            <Box sx={{ bgcolor: 'white', p: 0.5, borderRadius: 1, border: '1px solid #ccc', mb: 0.5 }}>
              <img src="https://www.gstatic.com/recaptcha/api2/logo_48.png" width="24" height="24" alt="logo" />
            </Box>
            <Typography variant="caption" sx={{ fontSize: '8px', color: '#666' }}>Privacy - Terms</Typography>
          </Box>
        </Box>
      )}
    </Box>
  )
}
