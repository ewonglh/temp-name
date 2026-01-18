import { createFileRoute } from '@tanstack/react-router'
import AngryNumbersGame from '../components/AngryNumbersGame'

export const Route = createFileRoute('/postal-code')({
  component: AngryNumbersGame,
})

export default AngryNumbersGame;
