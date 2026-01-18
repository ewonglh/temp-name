import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  Typography,
} from '@mui/material'
import TextFieldWithKeyboard from '../components/TextFieldWithKeyboard'
import RhythmPin from '../components/RhythmPin'
import { defaultUsers } from '../data/data'

export const Route = createFileRoute('/login')({
  component: LoginFlow,
})

function LoginFlow() {
  const [step, setStep] = useState<1 | 2>(1)
  const [serverPin] = useState(() =>
    Math.floor(100000 + Math.random() * 900000).toString(),
  )
  const [enteredPin, setEnteredPin] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = () => {
    const user = defaultUsers.find(
      (u) => u.username === username && u.password === password,
    )
    if (user) {
      setStep(2)
    } else {
      alert('Invalid credentials')
    }
  }

  const handleVerify = () => {
    if (enteredPin === serverPin) {
      alert('Identity Verified! Login Successful.')
    } else {
      alert(
        `Verification Failed. Entered: ${enteredPin || '(empty)'}, Expected: ${serverPin}`,
      )
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyItems: 'center',
        p: 4,
        pt: 12,
      }}
    >
      <Paper
        elevation={24}
        sx={{
          width: '100%',
          maxWidth: '400px',
          p: 4,
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography
          variant="h5"
          sx={{
            mb: 4,
            textAlign: 'center',
            fontWeight: 300,
            color: 'primary.main',
          }}
        >
          {step === 1 ? 'Secure Login' : 'Identity Verification'}
        </Typography>

        {step === 1 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextFieldWithKeyboard
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextFieldWithKeyboard
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              size="large"
              onClick={handleLogin}
              sx={{ mt: 2, py: 1.5 }}
            >
              Login
            </Button>
          </Box>
        )}

        {step === 2 && (
          <Box
            sx={{
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
            }}
          >
            <Box
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: 'background.default',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  color: 'text.secondary',
                  mb: 1,
                  letterSpacing: 1,
                }}
              >
                SERVER CHALLENGE PIN
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  fontFamily: 'monospace',
                  letterSpacing: 8,
                  color: 'success.main',
                  fontWeight: 'bold',
                }}
              >
                {serverPin}
              </Typography>
            </Box>

            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Enter the PIN above using the rhythm input.
            </Typography>

            <Box sx={{ my: 1 }}>
              <RhythmPin
                label="Enter Challenge PIN"
                onPinChange={setEnteredPin}
              />
            </Box>

            <Button
              variant="contained"
              color="success"
              size="large"
              onClick={handleVerify}
              sx={{ py: 1.5 }}
            >
              Verify Identity
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  )
}
