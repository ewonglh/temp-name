import { useCallback, useEffect, useRef, useState } from 'react'
import { Box, IconButton, TextField, Typography } from '@mui/material'
import { Delete } from 'lucide-react'
import type { TextFieldProps } from '@mui/material'
import './PhoneInput.css'

// Function to randomize dial layout
const randomizeDialLayout = () => {
  const numbers: Array<number | string> = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, '+', '*']
  const shuffled = [...numbers]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

interface PhoneInputProps extends Omit<TextFieldProps, 'value' | 'onChange'> {
  value?: string
  onChange?: (value: string) => void
}

export default function PhoneInput({
  value = '',
  onChange,

  ...textFieldProps
}: PhoneInputProps) {
  const [phoneNumber, setPhoneNumber] = useState(value)
  const [dialVisible, setDialVisible] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startAngle, setStartAngle] = useState(0)
  const [dialLayout, setDialLayout] = useState<Array<number | string>>(() =>
    randomizeDialLayout(),
  )
  const textFieldRef = useRef<HTMLDivElement>(null)
  const dialContainerRef = useRef<HTMLDivElement>(null)
  const dialRef = useRef<HTMLDivElement>(null)
  const dragStartRef = useRef<{
    x: number
    y: number
    rotation: number
  } | null>(null)
  const rotationRef = useRef(0)
  const hasInputRef = useRef(false)
  const draggedNumberRef = useRef<number | string | null>(null)

  // Update rotation ref whenever rotation changes
  useEffect(() => {
    rotationRef.current = rotation
  }, [rotation])

  useEffect(() => {
    if (onChange) {
      onChange(phoneNumber)
    }
  }, [phoneNumber, onChange])

  useEffect(() => {
    if (dialVisible && dialContainerRef.current) {
      const dialHeight = dialContainerRef.current.offsetHeight
      document.body.style.paddingBottom = `${dialHeight}px`

      setTimeout(() => {
        const input = textFieldRef.current?.querySelector('input')
        if (input) {
          input.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 100)
    } else {
      document.body.style.paddingBottom = ''
    }

    return () => {
      document.body.style.paddingBottom = ''
    }
  }, [dialVisible])

  // Get the number at the pointer position (0 degrees - where triangle points)
  const getNumberAtPointer = useCallback(
    (currentRotation: number): number | string | null => {
      const pointerAngle = 0 // 0 degrees (right side, where triangle points)
      const adjustedAngle = (pointerAngle - currentRotation + 360) % 360
      const slotAngle = 360 / dialLayout.length
      const slotIndex =
        Math.round(adjustedAngle / slotAngle) % dialLayout.length
      return dialLayout[slotIndex] ?? null
    },
    [dialLayout],
  )

  const handleDelete = () => {
    setPhoneNumber((prev) => prev.slice(0, -1))
  }

  const handleDialMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    if (dialRef.current) {
      const rect = dialRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const startX = e.clientX
      const startY = e.clientY

      const angle =
        Math.atan2(startY - centerY, startX - centerX) * (180 / Math.PI)
      dragStartRef.current = { x: startX, y: startY, rotation: rotation }
      setStartAngle(angle)
      setIsDragging(true)

      // Calculate which number was clicked
      const slotAngle = 360 / dialLayout.length
      // Normalize angle to 0-360 and adjust for current rotation
      const clickAngleOnDial = (angle - rotation + 360 * 2) % 360
      const slotIndex =
        Math.round(clickAngleOnDial / slotAngle) % dialLayout.length
      draggedNumberRef.current = dialLayout[slotIndex]
    }
  }

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !dialRef.current || !dragStartRef.current) return

      const rect = dialRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const currentX = e.clientX
      const currentY = e.clientY

      const currentAngle =
        Math.atan2(currentY - centerY, currentX - centerX) * (180 / Math.PI)
      const angleDiff = currentAngle - startAngle

      // Normalize angle difference
      let normalizedDiff = angleDiff
      if (normalizedDiff > 180) normalizedDiff -= 360
      if (normalizedDiff < -180) normalizedDiff += 360

      const newRotation = dragStartRef.current.rotation + normalizedDiff
      setRotation(newRotation)
      rotationRef.current = newRotation
    },
    [isDragging, startAngle],
  )

  const handleMouseUp = useCallback(() => {
    if (!isDragging || hasInputRef.current) {
      setIsDragging(false)
      dragStartRef.current = null
      hasInputRef.current = false
      return
    }

    const currentRotation = rotationRef.current
    const selectedNumber = getNumberAtPointer(currentRotation)

    if (selectedNumber !== null) {
      // Only register input if the dropped number matches the dragged number
      if (draggedNumberRef.current !== selectedNumber) {
        setIsDragging(false)
        dragStartRef.current = null
        draggedNumberRef.current = null
        return
      }

      hasInputRef.current = true

      if (selectedNumber === '+') {
        setPhoneNumber((prev) => prev + '+')
      } else if (selectedNumber === '*') {
        setPhoneNumber((prev) => prev + '*')
      } else if (typeof selectedNumber === 'number') {
        setPhoneNumber((prev) => prev + selectedNumber.toString())
      }

      // Randomize layout after input
      setDialLayout(randomizeDialLayout())
      setRotation(0)
      rotationRef.current = 0
    }

    setIsDragging(false)
    dragStartRef.current = null
    draggedNumberRef.current = null

    // Reset the input flag after a short delay
    setTimeout(() => {
      hasInputRef.current = false
    }, 100)
  }, [isDragging, getNumberAtPointer])

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  // Touch event handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()
    if (dialRef.current && e.touches.length > 0) {
      const rect = dialRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const touch = e.touches[0]
      const startX = touch.clientX
      const startY = touch.clientY

      const angle =
        Math.atan2(startY - centerY, startX - centerX) * (180 / Math.PI)
      dragStartRef.current = { x: startX, y: startY, rotation: rotation }
      setStartAngle(angle)
      setIsDragging(true)

      // Calculate which number was clicked
      const slotAngle = 360 / dialLayout.length
      const clickAngleOnDial = (angle - rotation + 360 * 2) % 360
      const slotIndex =
        Math.round(clickAngleOnDial / slotAngle) % dialLayout.length
      draggedNumberRef.current = dialLayout[slotIndex]
    }
  }

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (
        !isDragging ||
        !dialRef.current ||
        !dragStartRef.current ||
        e.touches.length === 0
      )
        return

      const rect = dialRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const touch = e.touches[0]
      const currentX = touch.clientX
      const currentY = touch.clientY

      const currentAngle =
        Math.atan2(currentY - centerY, currentX - centerX) * (180 / Math.PI)
      const angleDiff = currentAngle - startAngle

      let normalizedDiff = angleDiff
      if (normalizedDiff > 180) normalizedDiff -= 360
      if (normalizedDiff < -180) normalizedDiff += 360

      const newRotation = dragStartRef.current.rotation + normalizedDiff
      setRotation(newRotation)
      rotationRef.current = newRotation
    },
    [isDragging, startAngle],
  )

  const handleTouchEnd = useCallback(() => {
    if (!isDragging || hasInputRef.current) {
      setIsDragging(false)
      dragStartRef.current = null
      hasInputRef.current = false
      return
    }

    const currentRotation = rotationRef.current
    const selectedNumber = getNumberAtPointer(currentRotation)

    if (selectedNumber !== null) {
      // Only register input if the dropped number matches the dragged number
      if (draggedNumberRef.current !== selectedNumber) {
        setIsDragging(false)
        dragStartRef.current = null
        draggedNumberRef.current = null
        return
      }

      hasInputRef.current = true

      if (selectedNumber === '+') {
        setPhoneNumber((prev) => prev + '+')
      } else if (selectedNumber === '*') {
        setPhoneNumber((prev) => prev + '*')
      } else if (typeof selectedNumber === 'number') {
        setPhoneNumber((prev) => prev + selectedNumber.toString())
      }

      setDialLayout(randomizeDialLayout())
      setRotation(0)
      rotationRef.current = 0
    }

    setIsDragging(false)
    dragStartRef.current = null
    draggedNumberRef.current = null

    // Reset the input flag after a short delay
    setTimeout(() => {
      hasInputRef.current = false
    }, 100)
  }, [isDragging, getNumberAtPointer])

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('touchmove', handleTouchMove, {
        passive: false,
      })
      document.addEventListener('touchend', handleTouchEnd)
      return () => {
        document.removeEventListener('touchmove', handleTouchMove)
        document.removeEventListener('touchend', handleTouchEnd)
      }
    }
  }, [isDragging, handleTouchMove, handleTouchEnd])

  return (
    <Box className="phone-input-container">
      <Box className="phone-input-wrapper">
        <TextField
          {...textFieldProps}
          ref={textFieldRef}
          value={phoneNumber}
          onChange={(e) => {
            const newValue = e.target.value.replace(/[^0-9+*]/g, '')
            setPhoneNumber(newValue)
          }}
          onFocus={() => setDialVisible(true)}
          onBlur={() => setDialVisible(false)}
          onKeyDown={(e) => {
            e.preventDefault()
          }}
          className="dark-mode-text-field phone-number-input"
          sx={{
            flex: 1,
            '& .MuiInputBase-input': {
              color: 'white',
            },
          }}
        />
      </Box>
      {dialVisible && (
        <Box ref={dialContainerRef} className="rotary-dial-container">
          <Box className="rotary-dial-wrapper">
            <Box className="dial-pointer" />
            <Box
              ref={dialRef}
              className={`rotary-dial ${isDragging ? 'dragging' : ''}`}
              sx={{
                transform: `rotate(${rotation}deg)`,
                transition: isDragging ? 'none' : 'transform 0.3s ease-out',
              }}
              onMouseDown={handleDialMouseDown}
              onTouchStart={handleTouchStart}
            >
              {dialLayout.map((num, index) => {
                const angle = (index * 360) / dialLayout.length
                const radius = 35 // Percentage
                const x = Math.cos((angle * Math.PI) / 180) * radius
                const y = Math.sin((angle * Math.PI) / 180) * radius

                const pointerNumber = getNumberAtPointer(rotation)
                const isAtPointer =
                  pointerNumber === num &&
                  isDragging &&
                  pointerNumber === draggedNumberRef.current

                return (
                  <Box
                    key={`${num}-${index}`}
                    className={`dial-number ${isAtPointer ? 'at-pointer' : ''}`}
                    sx={{
                      position: 'absolute',
                      left: `calc(50% + ${x}%)`,
                      top: `calc(50% + ${y}%)`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {num}
                    </Typography>
                  </Box>
                )
              })}
              <Box className="dial-center">
                <IconButton
                  className="dial-delete"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleDelete()
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                  sx={{
                    bgcolor: 'error.main',
                    color: 'white',
                    '&:hover': { bgcolor: 'error.dark' },
                    width: '80%',
                    height: '80%',
                  }}
                >
                  <Delete size={24} />
                </IconButton>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  )
}
