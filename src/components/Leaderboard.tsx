import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { Trophy, Clock, Zap } from 'lucide-react'
import { useRegistration, formatTime } from '../context/RegistrationContext'

export default function Leaderboard() {
  const { leaderboard } = useRegistration()

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
            {leaderboard.map((entry, index) => (
              <TableRow 
                key={`${entry.username}-${index}`}
                sx={{ 
                  bgcolor: index === 0 ? 'rgba(251, 191, 36, 0.1)' : 
                           index === 1 ? 'rgba(148, 163, 184, 0.1)' :
                           index === 2 ? 'rgba(180, 83, 9, 0.1)' : 'transparent'
                }}
              >
                <TableCell sx={{ color: 'white', fontWeight: index < 3 ? 'bold' : 'normal' }}>
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                </TableCell>
                <TableCell sx={{ color: 'white' }}>{entry.username}</TableCell>
                <TableCell sx={{ color: 'white', fontFamily: 'monospace' }}>{formatTime(entry.time)}</TableCell>
                <TableCell sx={{ color: 'white' }}>{entry.combo}x</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
