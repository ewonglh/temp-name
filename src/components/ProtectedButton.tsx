import { Button, type ButtonProps } from '@mui/material'
import { useNavigate } from '@tanstack/react-router'
import { grantRouteAccess } from '../utils/routeProtection'

interface ProtectedButtonProps extends ButtonProps {
  targetPath: string
}

/**
 * Button component that grants access before navigating to protected routes
 */
export default function ProtectedButton({ targetPath, onClick, ...props }: ProtectedButtonProps) {
  const navigate = useNavigate()

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    
    // Grant access to the target route
    grantRouteAccess(targetPath)
    
    // Navigate to the route
    navigate({ to: targetPath })
    
    // Call original onClick if provided
    if (onClick) {
      onClick(e)
    }
  }

  return <Button {...props} onClick={handleClick} />
}
