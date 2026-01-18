import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { CircleUser, LogIn, Home, Menu, X, Gamepad2 } from 'lucide-react'
import {
  AppBar,
  Box,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material'
import {
  Calculator,
  ChevronLeft,
  Clock,
  Home,
  Keyboard as KeyboardIcon,
  LogIn,
  Menu as MenuIcon,
  Music,
  Phone,
  UserPlus,
  X,
} from 'lucide-react'
import { useRegistration, formatTime } from '../context/RegistrationContext'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false)
  const toggleDrawer = () => setIsOpen(!isOpen)
  
  const { timerRunning, elapsed } = useRegistration()

  const navItems = [
    { label: 'Home', path: '/', icon: <Home size={20} /> },
    { label: 'Login', path: '/login', icon: <LogIn size={20} /> },
    { label: 'Register', path: '/register', icon: <UserPlus size={20} /> },
  ]

  const demoItems = [
    { label: 'Phone Demo', path: '/demo/phone', icon: <Phone size={20} /> },
    { label: 'Rhythm Demo', path: '/demo/rhythm', icon: <Music size={20} /> },
    {
      label: 'Keyboard Demo',
      path: '/demo/keyboard',
      icon: <KeyboardIcon size={20} />,
    },
    { label: 'Date Demo', path: '/demo/date', icon: <Phone size={20} /> },
    { label: 'Security Demo', path: '/demo/security', icon: <UserPlus size={20} /> },
  ]

  return (
    <>
      <header className="p-4 flex items-center bg-gray-800 text-white shadow-lg">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
        <h1 className="ml-4 text-xl font-semibold">
          <Link to="/">
            Goofy Login
          </Link>
        </h1>
      </header>

      <aside
        className={`fixed top-0 left-0 h-full w-80 bg-gray-900 text-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleDrawer}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, fontWeight: 'bold' }}
          >
            INPUT HELL
          </Typography>
          
          {timerRunning && (
            <Chip
              icon={<Clock size={16} />}
              label={formatTime(elapsed)}
              color="error"
              sx={{ 
                mr: 2, 
                fontFamily: 'monospace',
                fontWeight: 'bold',
                animation: 'pulse 1s infinite',
                '@keyframes pulse': {
                  '0%, 100%': { opacity: 1 },
                  '50%': { opacity: 0.7 },
                },
              }}
            />
          )}
          
          <IconButton
            color="inherit"
            onClick={() => setIsCalculatorOpen(true)}
            sx={{ ml: 2 }}
          >
            <Calculator size={24} />
          </IconButton>
        </Toolbar>
      </AppBar>

          <Link
            to="/register"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2"
            activeProps={{
              className:
                'flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-2',
            }}
          >
            <CircleUser size={20} />
            <span className="font-medium">Register</span>
          </Link>

          <Link
            to="/game"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2"
            activeProps={{
              className:
                'flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-2',
            }}
          >
            <Gamepad2 size={20} />
            <span className="font-medium">Game</span>
          </Link>

          <Link
            to="/pshgame"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2"
            activeProps={{
              className:
                'flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-2',
            }}
          >
            <Gamepad2 size={20} />
            <span className="font-medium">Bouncy Security</span>
          </Link>

          {/* Demo Links Start */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={isOpen}
        onClose={toggleDrawer}
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
            boxSizing: 'border-box',
            bgcolor: 'background.paper',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: 1,
            justifyContent: 'flex-end',
            minHeight: 64,
          }}
        >
          <IconButton onClick={toggleDrawer}>
            <ChevronLeft />
          </IconButton>
        </Box>
        <Divider />
        <List sx={{ pt: 2 }}>
          {navItems.map((item) => (
            <ListItem
              key={item.label}
              disablePadding
              component={Link}
              to={item.path}
              onClick={toggleDrawer}
              sx={{
                color: 'inherit',
                textDecoration: 'none',
                '&.active': {
                  bgcolor: 'rgba(255, 255, 255, 0.08)',
                  '& .MuiListItemIcon-root': { color: 'primary.main' },
                  '& .MuiListItemText-primary': { fontWeight: 'bold' },
                },
              }}
            >
              <ListItemButton>
                <ListItemIcon sx={{ color: 'text.secondary', minWidth: 45 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
          <Divider sx={{ my: 2 }} />
          {demoItems.map((item) => (
            <ListItem
              key={item.label}
              disablePadding
              component={Link}
              to={item.path}
              onClick={toggleDrawer}
              sx={{
                color: 'inherit',
                textDecoration: 'none',
                '&.active': {
                  bgcolor: 'rgba(255, 255, 255, 0.08)',
                  '& .MuiListItemIcon-root': { color: 'primary.main' },
                },
              }}
            >
              <ListItemButton>
                <ListItemIcon sx={{ color: 'text.secondary', minWidth: 45 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Dialog
        open={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            height: '80vh',
            bgcolor: '#1a1a1a',
            color: 'white',
          },
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Desmos Scientific Calculator
          <IconButton
            aria-label="close"
            onClick={() => setIsCalculatorOpen(false)}
            sx={{ color: 'white' }}
          >
            <X size={20} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0, overflow: 'hidden' }}>
          <iframe
            src="https://www.desmos.com/scientific"
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
            }}
            title="Desmos Scientific Calculator"
          />
        </DialogContent>
      </Dialog>
      <Toolbar />
    </>
  )
}
