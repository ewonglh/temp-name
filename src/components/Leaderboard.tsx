import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { Trophy, Clock, Zap } from 'lucide-react'
import { useRegistration, formatTime } from '../context/RegistrationContext'

export default function Leaderboard() {
  const { leaderboard, username: currentUsername } = useRegistration()

  return (
    <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
        <Trophy size={32} color="#fbbf24" />
        Leaderboard
      </Typography>
      
      <TableContainer component={Paper} sx={{ bgcolor: 'rgba(30, 41, 59, 0.8)' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Rank</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Username</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Clock size={16} /> Time
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Zap size={16} /> Combo
                </Box>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leaderboard.map((entry, index) => {
              const isCurrentUser = entry.username === currentUsername
              
              return (
                <TableRow 
                  key={`${entry.username}-${index}`}
                  sx={{ 
                    bgcolor: isCurrentUser ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                    borderLeft: isCurrentUser ? '4px solid #3b82f6' : 'none'
                  }}
                >
                  <TableCell sx={{ color: 'white', fontWeight: isCurrentUser ? 'bold' : 'normal' }}>
                    #{index + 1}
                  </TableCell>
                  <TableCell sx={{ 
                    color: isCurrentUser ? '#60a5fa' : 'white',
                    fontWeight: isCurrentUser ? 'bold' : 'normal'
                  }}>
                    {entry.username}
                  </TableCell>
                  <TableCell sx={{ 
                    color: 'white', 
                    fontFamily: 'monospace',
                    fontWeight: isCurrentUser ? 'bold' : 'normal'
                  }}>
                    {formatTime(entry.time)}
                  </TableCell>
                  <TableCell sx={{ 
                    color: 'white',
                    fontWeight: isCurrentUser ? 'bold' : 'normal'
                  }}>
                    {entry.combo}x
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
