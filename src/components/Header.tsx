import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import {
  AppBar,
  Box,
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
  ChevronLeft,
  Home,
  Keyboard as KeyboardIcon,
  LogIn,
  Menu as MenuIcon,
  Music,
  Phone,
  UserPlus,
} from 'lucide-react'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const toggleDrawer = () => setIsOpen(!isOpen)

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
  ]

  return (
    <>
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
        </Toolbar>
      </AppBar>

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
      <Toolbar />
    </>
  )
}
