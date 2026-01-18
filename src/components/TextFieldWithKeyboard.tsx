import { useEffect, useRef, useState } from 'react'
import { Box, TextField } from '@mui/material'
import Keyboard, { initialKeyboardRows } from './Keyboard'
import type { TextFieldProps } from '@mui/material'

export default function TextFieldWithKeyboard(props: TextFieldProps) {
  const isControlled = props.value !== undefined
  const [localValue, setLocalValue] = useState('')
  const value = isControlled ? (props.value as string) : localValue

  const handleChange = (newValue: string) => {
    if (!isControlled) {
      setLocalValue(newValue)
    }

    // Propagate to parent
    if (props.onChange) {
      const event = {
        target: { value: newValue },
      } as React.ChangeEvent<HTMLInputElement>
      props.onChange(event)
    }
  }

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(e.target.value)
  }

  const [keyboardVisible, setKeyboardVisible] = useState(false)
  const [keyboardLayout, setKeyboardLayout] = useState(initialKeyboardRows)
  const textFieldRef = useRef<HTMLDivElement>(null)
  const keyboardRef = useRef<HTMLDivElement>(null)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.preventDefault()
  }

  const handleKeyboardMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    textFieldRef.current?.querySelector('input')?.focus()
  }

  useEffect(() => {
    if (keyboardVisible) {
      // since the keyboard is fixed at 30vh, we can directly set this
      // We use 30vh to ensure comfortable scrolling
      document.body.style.paddingBottom = 'calc(30vh)'

      // Scroll the input field into view
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
  }, [keyboardVisible])

  return (
    <>
      <TextField
        {...props}
        ref={textFieldRef}
        value={value}
        onChange={handleTextFieldChange}
        placeholder=""
        onFocus={() => setKeyboardVisible(true)}
        onBlur={() => setKeyboardVisible(false)}
        onKeyDown={handleKeyDown}
        className="hidden-caret"
      />
      {keyboardVisible && (
        <Box ref={keyboardRef} onMouseDown={handleKeyboardMouseDown}>
          <Keyboard
            value={value}
            onChange={handleChange}
            currentLayout={keyboardLayout}
            onLayoutChange={setKeyboardLayout}
          />
        </Box>
      )}
    </>
  )
}
