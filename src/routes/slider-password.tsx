import { createFileRoute } from '@tanstack/react-router'
import SliderPasswordGame from '../components/SliderPasswordGame'

export const Route = createFileRoute('/slider-password')({
  component: SliderPasswordGame,
})

export default SliderPasswordGame;
