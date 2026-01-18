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
  ButtonGroup,
  Divider,
} from '@mui/material'
import { ArrowRight, Check, AlertCircle } from 'lucide-react'
import { useRegistration } from '../context/RegistrationContext'
import PhoneInput from '../components/PhoneInput'
import RhythmPin from '../components/RhythmPin'
import SecurityQuestions from '../components/SecurityQuestions'
import Slider from '../components/slider'
import TextFieldWithKeyboard from '../components/TextFieldWithKeyboard'
import AngryNumbersGame from '../components/AngryNumbersGame'
import { usePshGame } from '../components/psh'
import { useNavigate } from '@tanstack/react-router'
import { grantRouteAccess } from '../utils/routeProtection'

export const Route = createFileRoute('/register')({
  component: RegisterFlow,
})

const TAKEN_USERNAMES = ['admin', 'user', 'test', 'demo']

const steps = [
  'Account',
  'Phone',
  'Postcode',
  'Security Question',
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
  const [enteredVerificationCode, setEnteredVerificationCode] = useState('')
  const [errors, setErrors] = useState<string[]>([])

  const navigate = useNavigate()
  const registration = useRegistration()
  const { sceneRef, isWin: pshWin } = usePshGame()

  // Start timer on component mount
  useEffect(() => {
    if (!registration.timerRunning) {
      registration.startTimer()
      registration.setIsRegistering(true)
    }
  }, [])

  // Generate random tokens whenever entering respective steps
  useEffect(() => {
    if (step === 2) {
      setTargetPin(Math.floor(100000 + Math.random() * 900000).toString())
      setRhythmComplete(false)
    }
  }, [step])

  const validateUsername = () => {
    if (username.length < 4) return ['Username must be at least 4 characters']
    if (TAKEN_USERNAMES.includes(username.toLowerCase())) return ['Username is already taken']
    return []
  }

  const validatePassword = () => {
    if (password.length <= 8) return ['Password must be longer than 8 characters']
    if (!/[A-Z]/.test(password)) return ['Passsword must contain at least 1 capital letter']
    if (!/[0-9]/.test(password)) return ['Password must contain at least 1 number']
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return ['Password must contain at least 1 symbol']
    if (password !== confirmPassword) return ['Passwords do not match']
    return []
  }

  const validatePhone = () => {
    // Phone should have country code + at least 8 digits
    const digitsOnly = phone.replace(/\D/g, '')
    if (digitsOnly.length < 10) return ['Phone number must include country code + at least 8 digits']
    return []
  }

  const validateAnswer = (answer: string, verify: string, label: string) => {
    if (answer.length < 4) return [`${label} must be at least 4 characters`]
    if (answer !== verify) return [`${label} does not match`]
    return []
  }

  const validateSecurityQuestion = (question: string) => {
    const errs: string[] = []
    const words = question.trim().split(/\s+/)
    if (!question) {
      return ['Please construct a security question']
    }

    if (!/^(Who|What|When|Where|How)/i.test(question)) {
      // Check regex: ^(Who|What|When|Where|How).*
      return ['Question must start with an appropriate word']
    } else if (words.length < 4) {
       return ['Question must contain at least 4 words']
    } else if (!question.trim().endsWith('?')) {
      // Check if ? at end
      return ['Question must end with "?"']
    } else {
      // Check if the question is too generic
      const genericQuestions = [
        'What is your name?',
        'What is your favorite color?',
        'What is your favorite food?',
        'What is your favorite animal?',
        'What is your favorite movie?',
        'What is your favorite book?',
        'What is your favorite song?',
        'What is your mother\'s maiden name?'
      ]
      if (genericQuestions.includes(question)) {
        errs.push('Question is too generic')
      }
    }
    return errs
  }

  const countUnique = (s : string) : number => {
    const set : Set<string> = new Set(s.split(''))
    return set.size
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
      case 3: // Postcode (Angry Numbers Game)
        if (enteredVerificationCode.length !== 6) {
          validationErrors = ['Please enter a valid postcode']
        }
        break
      case 4: // Security Q1 + A1
        validationErrors = validateSecurityQuestion(securityQ1)
        if (securityA1.length < 8) validationErrors.push('Your answer is too short!')
        if (countUnique(securityA1) === 1) validationErrors.push('I know what you\'re doing...')
        if (countUnique(securityA1) === 2) validationErrors.push('I know what you\'re doing...')
        break
      case 5: // Verify A1
        validationErrors = validateAnswer(securityA1, verifyA1, 'Answer')
        break
      case 6: // PshGame (Bouncy)
        if (!pshWin) validationErrors = ['Solve the CAPTCHA to continue']
        break
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      return
    }

    setErrors([])

    if (step === 8) {
      // Complete registration data gathering
      registration.setUsername(username)
      registration.setPhone(phone)
      registration.setSecurityQ1(securityQ1)
      registration.setSecurityA1(securityA1)
      registration.setCombo(rhythmCombo)
      registration.setIsRegistering(true)
      
      // Grant access to lostwoods and navigate
      grantRouteAccess('/lostwoods')
      navigate({ to: '/lostwoods' })
    } else {
      setStep(step + 1)
    }
  }

  const handleRhythmComplete = (success: boolean, combo: number) => {
    setRhythmComplete(success)
    setRhythmCombo(combo)
  }

  // Map internal step (0-8) to visible stepper steps (0-4)
  const getActiveStep = () => {
    if (step === 0) return 0 // Account
    if (step === 1 || step === 2) return 1 // Phone + Rhythm
    if (step === 3) return 2 // Postcode
    if (step === 4 || step === 5) return 3 // Q1 + V1
    if (step === 6) return 4 // Psh
    return 0
  }

  const skipToForest = (path: string) => {
    grantRouteAccess(path)
    navigate({ to: path })
  }

  return (
    <Box sx={{ minHeight: '100vh', p: 4, pt: 10 }}>
      <Typography variant="h4" sx={{ textAlign: 'center', mb: 3 }}>
        Registration
      </Typography>

      <Stepper activeStep={getActiveStep()} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* DEBUG SECTION */}
      <Box sx={{ mb: 4, p: 2, border: '1px dashed #666', borderRadius: 2, bgcolor: 'rgba(255,255,255,0.05)' }}>
        <Typography variant="caption" sx={{ display: 'block', mb: 1, opacity: 0.6 }}>DEBUG: SKIP TO STEPS</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          <ButtonGroup size="small" variant="outlined" color="primary">
            <Button onClick={() => setStep(0)}>0: Account</Button>
            <Button onClick={() => setStep(1)}>1: Phone</Button>
            <Button onClick={() => setStep(2)}>2: Rhythm (HIDDEN)</Button>
            <Button onClick={() => setStep(3)}>3: Postcode</Button>
            <Button onClick={() => setStep(4)}>4: Q1</Button>
            <Button onClick={() => setStep(5)}>5: V1 (HIDDEN)</Button>
            <Button onClick={() => setStep(6)}>6: Psh (HIDDEN)</Button>
          </ButtonGroup>
        </Box>
        <Divider sx={{ mb: 2, opacity: 0.2 }} />
        <Typography variant="caption" sx={{ display: 'block', mb: 1, opacity: 0.6 }}>DEBUG: SKIP TO ROUTES</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <ButtonGroup size="small" variant="outlined" color="secondary">
            <Button onClick={() => skipToForest('/lostwoods')}>/lostwoods</Button>
            <Button onClick={() => skipToForest('/zwei')}>/zwei</Button>
            <Button onClick={() => skipToForest('/tres')}>/tres</Button>
            <Button onClick={() => { registration.setIsRegistering(true); skipToForest('/youwin'); }}>/youwin (Finalize)</Button>
          </ButtonGroup>
        </Box>
      </Box>

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
            />
            <TextFieldWithKeyboard
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
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
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Paper elevation={0} sx={{ p: 2, bgcolor: '#f9f9f9', border: '1px solid #dcdcdc', borderRadius: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ width: 24, height: 24, border: '2px solid #c1c1c1', borderRadius: '2px', bgcolor: 'white' }} />
              <Typography variant="body1" sx={{ color: '#555', flex: 1, fontFamily: 'Roboto, sans-serif' }}>
                I'm not a robot
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.8 }}>
                <img src="https://www.gstatic.com/recaptcha/api2/logo_48.png" width="32" height="32" alt="logo" />
                <Typography variant="caption" sx={{ fontSize: '8px', color: '#666' }}>reCAPTCHA</Typography>
              </Box>
            </Paper>
            <Box>
              <Typography variant="body2" sx={{ mb: 2, color: 'rgba(255,255,255,0.7)' }}>
                Verification required: Focus the input to begin phone identity sequence.
              </Typography>
              <PhoneInput value={phone} onChange={setPhone} />
            </Box>
          </Box>
        )}

        {/* Step 2: Rhythm PIN */}
        {step === 2 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Paper elevation={0} sx={{ p: 2, bgcolor: '#f9f9f9', border: '1px solid #dcdcdc', borderRadius: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
               <Box sx={{ width: 24, height: 24, border: '2px solid #c1c1c1', borderRadius: '2px', bgcolor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {rhythmComplete && <Check size={20} color="#00aa00" />}
               </Box>
              <Typography variant="body1" sx={{ color: '#555', flex: 1, fontFamily: 'Roboto, sans-serif' }}>
                {rhythmComplete ? 'Verification successful' : 'Verification in progress...'}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.8 }}>
                <img src="https://www.gstatic.com/recaptcha/api2/logo_48.png" width="32" height="32" alt="logo" />
                <Typography variant="caption" sx={{ fontSize: '8px', color: '#666' }}>reCAPTCHA</Typography>
              </Box>
            </Paper>
            <Box>
              <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
                Enter PIN: <strong>{targetPin}</strong>
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
          </Box>
        )}

        {/* Step 3: Postcode */}
        {step === 3 && (
          <Box sx={{ height: 500, overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ transform: 'scale(0.8)', transformOrigin: 'top center' }}>
              <AngryNumbersGame 
                onSubmit={setEnteredVerificationCode}
              />
            </Box>
            {enteredVerificationCode.length === 6 && (
              <Alert severity="success" sx={{ mt: 2 }}>
                Valid postcode entered!
              </Alert>
            )}
          </Box>
        )}

        {/* Step 4: Security Q1 */}
        {step === 4 && (
          <Box>
            <SecurityQuestions onQuestionChange={setSecurityQ1} />
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>Your answer:</Typography>
              <Slider
                value={securityA1}
                onChange={setSecurityA1}
                label="Answer"
              />
            </Box>
          </Box>
        )}

        {/* Step 5: Verify A1 */}
        {step === 5 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Verify your answer to: "{securityQ1}"
            </Typography>
            <Slider
              value={verifyA1}
              onChange={setVerifyA1}
              label="Re-enter Answer"
            />
          </Box>
        )}


        {/* Step 6: Bouncy Security (PshGame) */}
        {step === 6 && (
          <Box sx={{ height: 600, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

            <Box sx={{ transform: 'scale(0.6)', transformOrigin: 'top center', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2 }}>
              <div ref={sceneRef} />
            </Box>
            {pshWin && (
              <Alert severity="success" sx={{ mt: 2 }}>
                Security cleared!
              </Alert>
            )}
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
