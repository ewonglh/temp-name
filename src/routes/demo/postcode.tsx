import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/demo/postcode')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/demo/postcode"!</div>
}
