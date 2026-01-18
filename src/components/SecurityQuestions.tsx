import { useState, useEffect } from 'react'
import { Box, Typography, TextField, IconButton } from '@mui/material'
import { X, SendHorizontal } from 'lucide-react'
import './SecurityQuestions.css'

interface Word {
  id: string
  text: string
  x: number
  y: number
}

interface SecurityQuestionsProps {
  onQuestionChange?: (question: string) => void
}

const DICTIONARY = [
  'What', 'is', 'your', "mother's", 'maiden', 'name', '?',
  'Where', 'did', 'you', 'go', 'to', 'high', 'school',
  'was', 'the', 'first', 'pet', 'had', 'When', 'Who', 'How',
  'favourite', 'color', 'childhood', 'hero', 'street', 'city',
  'born', 'in', 'and', 'many', 'times', 'food', 'animal', 'book', 'song',
  'pizza', 'topping', 'that', 'should', 'be', 'illegal',
  'least', 'favorite', 'country', 'official', 'crime', 'punishment'
]

export default function SecurityQuestions({ onQuestionChange }: SecurityQuestionsProps) {
  const [selectedWords, setSelectedWords] = useState<string[]>([])
  const [isDragging, setIsDragging] = useState(false)
  // Initialize words with random positions
  const randomizeWords = () => DICTIONARY.map((text, index) => ({
    id: `${text}-${index}-${Math.random()}`,
    text,
    x: 5 + Math.random() * 85, // 5% to 90%
    y: 5 + Math.random() * 85, // 5% to 90%
  }))
  const [words, setWords] = useState<Word[]>(randomizeWords())

  const questionString = selectedWords.join(' ')

  // Notify parent when question changes
  useEffect(() => {
    if (onQuestionChange) {
      onQuestionChange(questionString)
    }
  }, [questionString, onQuestionChange])

  const handleDragStart = (e: React.DragEvent, word: Word) => {
    e.dataTransfer.setData('word_id', word.id)
    e.dataTransfer.setData('word_text', word.text)
    setIsDragging(true)
  }

  const handleDragEnd = () => {
    setIsDragging(false)
    setWords(randomizeWords());
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const text = e.dataTransfer.getData('word_text')
    if (text) {
      setSelectedWords(prev => [...prev, text])
    }
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const removeWord = (index: number) => {
    setSelectedWords(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <Box sx={{ p: 4, position: 'relative', minHeight: '400px' }}>
      <Typography variant="h5" sx={{ mb: 2, textAlign: 'center' }}>
        Identity Verification
      </Typography>
      <Typography variant="body2" sx={{ mb: 3, textAlign: 'center', opacity: 0.7 }}>
        Drag words from around the screen into the box to form your security question.
      </Typography>

      <Box
        className={`drop-zone-container ${isDragging ? 'drop-zone-active' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {selectedWords.length === 0 ? (
          <Typography className="placeholder-text">
            Drop words here to form a question...
          </Typography>
        ) : (
          selectedWords.map((word, index) => (
            <Box key={index} className="selected-word">
              {word}
              <X
                size={14}
                className="remove-word"
                onClick={() => removeWord(index)}
              />
            </Box>
          ))
        )}
      </Box>
      
      <Box sx={{display:"flex"}}>
        <TextField
          fullWidth
          label="Constructed Question"
          value={questionString}
          variant="standard"
          inputProps={{ readOnly: true }}
          sx={{ mt: 2, '& .MuiInputBase-input': { color: '#3b82f6' } }}
        />
      </Box>

      {/* Scattered Words Layer */}
      <div className="security-game-overlay">
        {words.map((word) => (
          <div
            key={word.id}
            draggable
            onDragStart={(e) => handleDragStart(e, word)}
            onDragEnd={handleDragEnd}
            className="scattered-word"
            style={{
              left: `${word.x}%`,
              top: `${word.y}%`,
            }}
          >
            {word.text}
          </div>
        ))}
      </div>
    </Box>
  )
}
