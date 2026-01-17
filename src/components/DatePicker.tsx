import { useEffect, useRef, useState } from 'react'
import { Box, Button, TextField, Typography } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar'
import dayjs from 'dayjs'
import type { TextFieldProps } from '@mui/material'
import './DatePicker.css'

export default function DatePicker(props: TextFieldProps) {
  const [days, setDays] = useState(1)
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Calculate dayjs object from days starting from 1/1/0001
  // dayjs(new Date(1, 0, 1)) might handle year 1 differently across browsers
  // Standard way in dayjs to set year to 1:
  const getDayjsFromDays = (d: number) => {
    // 1/1/0001
    const epoch = dayjs('0001-01-01')
    return epoch.add(d - 1, 'day')
  }

  const currentDate = getDayjsFromDays(days)
  const displayValue = `${currentDate.format('MMMM D, YYYY')} (${days} days)`

  useEffect(() => {
    if (isOpen && containerRef.current) {
      const height = containerRef.current.offsetHeight
      document.body.style.paddingBottom = `${height}px`
    } else {
      document.body.style.paddingBottom = ''
    }
  }, [isOpen])

  const [primeInput, setPrimeInput] = useState('')
  const [error, setError] = useState('')

  const isPrime = (num: number) => {
    if (num <= 1) return false
    if (num === 2 || num === 3) return true
    if (num % 2 === 0 || num % 3 === 0) return false
    for (let i = 5; i * i <= num; i += 6) {
      if (num % i === 0 || num % (i + 2) === 0) return false
    }
    return true
  }

  const handleMathAction = (action: 'multiply' | 'divide') => {
    const num = parseInt(primeInput)
    if (isNaN(num)) {
      setError('Not a number')
      return
    }
    if (!isPrime(num)) {
      setError('Not a prime number')
      return
    }

    setError('')
    if (action === 'multiply') {
      setDays((prev) => prev * num)
    } else {
      // For division, we floor it or only allow if divisible?
      // Let's just floor it to keep the "hell" aspect consistent
      setDays((prev) => Math.max(1, Math.floor(prev / num)))
    }
  }

  const handleReset = () => {
    setDays(1)
    setPrimeInput('')
    setError('')
  }

  return (
    <Box
      sx={{ width: '50vh' }}
      onBlur={(e) => {
        // If the new focus target is not inside this component, close it
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setIsOpen(false)
        }
      }}
    >
      <TextField
        {...props}
        value={displayValue}
        onFocus={() => setIsOpen(true)}
        inputProps={{
          readOnly: true,
          inputMode: 'none',
        }}
        className="dark-mode-text-field hidden-caret"
        sx={{
          '& .MuiInputBase-input': {
            cursor: 'default',
          },
        }}
      />

      {isOpen && (
        <Box className="date-picker-overlay" ref={containerRef}>
          <Box className="date-picker-container">
            <Typography variant="h6" sx={{ color: 'white' }}>
              Select Date
            </Typography>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box
                onMouseDown={(e) => e.preventDefault()}
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: 2,
                  p: 1,
                  display: 'flex',
                  justifyContent: 'center',
                  '& .MuiDateCalendar-root': {
                    color: 'white',
                    height: 'auto',
                    minHeight: '320px',
                    width: '100%',
                    maxWidth: '400px',
                  },
                  '& .MuiTypography-root': { color: 'white' },
                  '& .MuiSvgIcon-root': { color: 'white' },
                  '& .MuiPickersDay-root': {
                    color: 'white',
                    '&.Mui-selected': {
                      bgcolor: 'primary.main',
                    },
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                    },
                  },
                }}
              >
                <DateCalendar
                  value={currentDate}
                  readOnly
                  views={['year', 'month', 'day']}
                />
              </Box>
            </LocalizationProvider>

            <Box sx={{ width: '100%', maxWidth: '300px', mb: 1 }}>
              <TextField
                size="small"
                fullWidth
                placeholder="Enter prime number..."
                value={primeInput}
                onChange={(e) => {
                  setPrimeInput(e.target.value.replace(/[^0-9]/g, ''))
                  setError('')
                }}
                error={!!error}
                helperText={error}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                    },
                  },
                  '& .MuiFormHelperText-root': {
                    color: error ? 'error.main' : 'rgba(255, 255, 255, 0.5)',
                    textAlign: 'center',
                    fontWeight: 'bold',
                  },
                }}
              />
            </Box>

            <Box className="math-buttons">
              <Button
                variant="contained"
                className="math-btn math-btn-prime"
                onClick={() => handleMathAction('multiply')}
                disabled={!primeInput}
              >
                Multiply
              </Button>
              <Button
                variant="contained"
                className="math-btn math-btn-prime"
                onClick={() => handleMathAction('divide')}
                disabled={!primeInput}
              >
                Divide
              </Button>
              <Button
                variant="contained"
                className="math-btn math-btn-reset"
                onClick={handleReset}
              >
                Reset
              </Button>
            </Box>

            <Typography className="days-display">
              {days.toLocaleString()} DAYS SINCE 0001
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  )
}
