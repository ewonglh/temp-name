import DatePicker from '@/components/DatePicker'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/demo/date')({
  component: RouteComponent,
})

function RouteComponent() {
  return <DatePicker/>
}
