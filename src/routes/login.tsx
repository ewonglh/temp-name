import { createFileRoute } from '@tanstack/react-router'
import TextFieldWithKeyboard from '../components/TextFieldWithKeyboard'

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return <header className="min-h-screen flex flex-col items-center justify-center bg-[#282c34] text-white text-[calc(10px+2vmin)]">
            <TextFieldWithKeyboard label="Username" />
        </header>
}
