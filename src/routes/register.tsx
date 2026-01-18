import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
  Alert,
} from '@mui/material'
import { ArrowRight, Check, AlertCircle } from 'lucide-react'
import { useRegistration } from '../context/RegistrationContext'
import PhoneInput from '../components/PhoneInput'
import RhythmPin from '../components/RhythmPin'
import SecurityQuestions from '../components/SecurityQuestions'
import TextFieldWithKeyboard from '../components/TextFieldWithKeyboard'
import Leaderboard from '../components/Leaderboard'
import { saveUserData } from '../data/Data'

export const Route = createFileRoute('/register')({
  component: RegisterFlow,
})

const TAKEN_USERNAMES = ['admin', 'user', 'test', 'demo']

const steps = [
  'Account',
  'Phone',
  'Bot Check',
  'Security Q1',
  'Security Q2',
]

function RegisterFlow() {
  const [step, setStep] = useState(0)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [targetPin, setTargetPin] = useState('')
  const [rhythmComplete, setRhythmComplete] = useState(false)
  const [rhythmCombo, setRhythmCombo] = useState(0)
  const [securityQ1, setSecurityQ1] = useState('')
  const [securityA1, setSecurityA1] = useState('')
  const [verifyA1, setVerifyA1] = useState('')
  const [securityQ2, setSecurityQ2] = useState('')
  const [securityA2, setSecurityA2] = useState('')
  const [verifyA2, setVerifyA2] = useState('')
  const [errors, setErrors] = useState<string[]>([])
  const [complete, setComplete] = useState(false)

  const registration = useRegistration()

  // Start timer on component mount
  useEffect(() => {
    if (!registration.timerRunning && !complete) {
      registration.startTimer()
    }
  }, [])

  // Generate random PIN
  useEffect(() => {
    setTargetPin(Math.floor(1000 + Math.random() * 9000).toString())
  }, [])

  const validateUsername = () => {
    const errs: string[] = []
    if (username.length <= 4) errs.push('Username must be at least 4 characters')
    if (TAKEN_USERNAMES.includes(username.toLowerCase())) errs.push('Username is already taken')
    return errs
  }

  const validatePassword = () => {
    const errs: string[] = []
    if (password.length <= 8) errs.push('Password must be longer than 8 characters')
    if (!/[A-Z]/.test(password)) errs.push('Password must contain at least 1 capital letter')
    if (!/[0-9]/.test(password)) errs.push('Password must contain at least 1 number')
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errs.push('Password must contain at least 1 symbol')
    if (password !== confirmPassword) errs.push('Passwords do not match')
    return errs
  }

  const validatePhone = () => {
    const errs: string[] = []
    // Phone should have country code + at least 8 digits
    const digitsOnly = phone.replace(/\D/g, '')
    if (digitsOnly.length < 10) errs.push('Phone number must include country code + at least 8 digits')
    return errs
  }

  const validateAnswer = (answer: string, verify: string, label: string) => {
    const errs: string[] = []
    if (answer.length < 4) errs.push(`${label} must be at least 4 characters`)
    if (answer !== verify) errs.push(`${label} does not match`)
    return errs
  }

  const handleNext = () => {
    let validationErrors: string[] = []

    switch (step) {
      case 0: // Username + Password
        validationErrors = [...validateUsername(), ...validatePassword()]
        break
      case 1: // Phone
        validationErrors = validatePhone()
        break
      case 2: // Rhythm PIN
        if (!rhythmComplete) validationErrors = ['Complete the rhythm game to continue']
        break
      case 3: // Security Q1 + A1
        if (!securityQ1) validationErrors.push('Please construct a security question')
        if (securityA1.length < 4) validationErrors.push('Answer must be at least 4 characters')
        break
      case 4: // Verify A1
        validationErrors = validateAnswer(securityA1, verifyA1, 'Answer 1')
        break
      case 5: // Security Q2 + A2
        if (!securityQ2) validationErrors.push('Please construct a security question')
        if (securityA2.length < 4) validationErrors.push('Answer must be at least 4 characters')
        break
      case 6: // Verify A2
        validationErrors = validateAnswer(securityA2, verifyA2, 'Answer 2')
        break
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      return
    }

    setErrors([])

    if (step === 6) {
      // Complete registration
      const finalTime = registration.stopTimer()
      registration.setUsername(username)
      registration.setPhone(phone)
      registration.setSecurityQ1(securityQ1)
      registration.setSecurityA1(securityA1)
      registration.setSecurityQ2(securityQ2)
      registration.setSecurityA2(securityA2)
      registration.setCombo(rhythmCombo)
      saveUserData({username : registration.username, time : finalTime, combo : rhythmCombo});
      setComplete(true)
    } else {
      setStep(step + 1)
    }
  }

  const handleRhythmComplete = (success: boolean, combo: number) => {
    setRhythmComplete(success)
    setRhythmCombo(combo)
  }

  if (complete) {
    return (
      <Box sx={{ minHeight: '100vh', p: 4, pt: 10 }}>
        <Typography variant="h3" sx={{ textAlign: 'center', mb: 2, color: '#22c55e' }}>
          <Check size={48} style={{ verticalAlign: 'middle' }} /> Registration Complete!
        </Typography>
        <Typography variant="h6" sx={{ textAlign: 'center', mb: 4, opacity: 0.7 }}>
          Welcome to Input Hell, {username}!
        </Typography>
        <Leaderboard />
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', p: 4, pt: 10 }}>
      <Typography variant="h4" sx={{ textAlign: 'center', mb: 3 }}>
        Registration
      </Typography>

      <Stepper activeStep={step} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Paper sx={{ maxWidth: 600, mx: 'auto', p: 4 }}>
        {errors.length > 0 && (
          <Alert severity="error" sx={{ mb: 3 }} icon={<AlertCircle size={20} />}>
            {errors.map((err, i) => (
              <div key={i}>{err}</div>
            ))}
          </Alert>
        )}

        {/* Step 0: Username + Password */}
        {step === 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextFieldWithKeyboard
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              helperText="Must be longer than 4 characters and not taken"
            />
            <TextFieldWithKeyboard
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              helperText="8+ chars, 1 capital, 1 number, 1 symbol"
            />
            <TextFieldWithKeyboard
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
            />
          </Box>
        )}

        {/* Step 1: Phone */}
        {step === 1 && (
          <Box>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Enter your phone number using the rotary dial. Include country code.
            </Typography>
            <PhoneInput value={phone} onChange={setPhone} />
          </Box>
        )}

        {/* Step 2: Rhythm PIN */}
        {step === 2 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
              Prove you're human! Enter PIN: <strong>{targetPin}</strong>
            </Typography>
            <RhythmPin
              targetPin={targetPin}
              onComplete={handleRhythmComplete}
            />
            {rhythmComplete && (
              <Alert severity="success" sx={{ mt: 2 }}>
                PIN verified! Combo: {rhythmCombo}x
              </Alert>
            )}
          </Box>
        )}

        {/* Step 3: Security Q1 */}
        {step === 3 && (
          <Box>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Drag words to construct your first security question:
            </Typography>
            <SecurityQuestions onQuestionChange={setSecurityQ1} />
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>Your answer:</Typography>
              <TextFieldWithKeyboard
                value={securityA1}
                onChange={(e) => setSecurityA1(e.target.value)}
                label="Answer 1"
              />
            </Box>
          </Box>
        )}

        {/* Step 4: Verify A1 */}
        {step === 4 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Verify your answer to: "{securityQ1}"
            </Typography>
            <TextFieldWithKeyboard
              value={verifyA1}
              onChange={(e) => setVerifyA1(e.target.value)}
              label="Re-enter Answer 1"
            />
          </Box>
        )}

        {/* Step 5: Security Q2 */}
        {step === 5 && (
          <Box>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Drag words to construct your second security question:
            </Typography>
            <SecurityQuestions onQuestionChange={setSecurityQ2} />
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>Your answer:</Typography>
              <TextFieldWithKeyboard
                value={securityA2}
                onChange={(e) => setSecurityA2(e.target.value)}
                label="Answer 2"
              />
            </Box>
          </Box>
        )}

        {/* Step 6: Verify A2 */}
        {step === 6 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Verify your answer to: "{securityQ2}"
            </Typography>
            <TextFieldWithKeyboard
              value={verifyA2}
              onChange={(e) => setVerifyA2(e.target.value)}
              label="Re-enter Answer 2"
            />
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
          <Button
            variant="contained"
            onClick={handleNext}
            endIcon={step === 6 ? <Check /> : <ArrowRight />}
            size="large"
          >
            {step === 6 ? 'Complete Registration' : 'Next'}
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}
