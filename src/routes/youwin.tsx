import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/youwin')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Congratulations you have signed in!</div>
}
