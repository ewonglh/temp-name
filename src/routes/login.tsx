import { createFileRoute } from '@tanstack/react-router'
import TextFieldWithKeyboard from '@/components/TextFieldWithKeyboard'
import PhoneInput from '@/components/PhoneInput'

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return <header className="min-h-screen flex flex-col padding-10 items-center bg-[#282c34] text-white text-[calc(10px+2vmin)]">
            <TextFieldWithKeyboard label="Username" />
            <PhoneInput label="Phone Number" />
        </header>
}
