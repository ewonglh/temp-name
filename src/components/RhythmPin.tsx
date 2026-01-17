import { useState, useRef, useEffect } from 'react';
import { TextField, Box } from '@mui/material';
import type { TextFieldProps } from '@mui/material';
import { Delete } from 'lucide-react';
import '../theme/DarkModeTheme.css';
import './RhythmPin.css';

interface Note {
    id: number;
    value: number | 'backspace';
    y: number;
    laneIndex: number; // 0-9
    speed: number;
    hit: boolean;
}

// interface RhythmPinProps extends Omit<TextFieldProps, 'value' | 'onChange'> {}
type RhythmPinProps = TextFieldProps;

export default function RhythmPin({
    ...textFieldProps
}: RhythmPinProps) {
    const [pin, setPin] = useState('');
    const [gameActive, setGameActive] = useState(false);
    const [notes, setNotes] = useState<Note[]>([]);
    const [feedback, setFeedback] = useState<Record<string, 'hit' | 'miss' | null>>({});
    
    // Game loop refs
    const requestRef = useRef<number | undefined>(undefined);
    const lastTimeRef = useRef<number | undefined>(undefined);
    const notesRef = useRef<Note[]>([]);
    const gameContainerRef = useRef<HTMLDivElement>(null);

    // Lane configuration
    const lanes: (number | 'backspace')[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'backspace'];
    const SPAWN_RATE = 500; // ms
    const BASE_SPEED = 0.2; // px per ms
    const HIT_Y_THRESHOLD = 260; // Target Y position (approximate, based on CSS container height)
    const HIT_WINDOW = 40; // +/- pixels

    const lastSpawnTime = useRef<number>(0);

    // useEffect(() => {
    //     if (onChange) {
    //         onChange(pin);
    //     }
    // }, [pin, onChange]);

    const spawnNote = (time: number) => {
        if (time - lastSpawnTime.current > SPAWN_RATE) {
            const laneIndex = Math.floor(Math.random() * 11);
            const newNote: Note = {
                id: time, // simple ID based on spawn time
                value: lanes[laneIndex],
                y: -50, // Start above view
                laneIndex,
                speed: BASE_SPEED + Math.random() * 0.1, // Slight speed variation
                hit: false
            };
            notesRef.current.push(newNote);
            lastSpawnTime.current = time;
        }
    };

    const updateGame = (time: number) => {
        if (!lastTimeRef.current) lastTimeRef.current = time;
        const deltaTime = time - lastTimeRef.current;
        lastTimeRef.current = time;

        // Move notes
        notesRef.current = notesRef.current.filter(note => {
            note.y += note.speed * deltaTime;
            // Remove notes that go off screen
            return note.y < 350;
        });

        spawnNote(time);
        
        // React state update for rendering
        setNotes([...notesRef.current]);
        
        requestRef.current = requestAnimationFrame(updateGame);
    };

    const startGame = () => {
        setGameActive(true);
        lastTimeRef.current = undefined;
        notesRef.current = [];
        setNotes([]);
        requestRef.current = requestAnimationFrame(updateGame);
    };

    const stopGame = () => {
        setGameActive(false);
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };

    const handleTargetClick = (targetValue: number | 'backspace', e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault(); // Prevent focus loss if possible
        
        // Find a note in the simplified collision window
        // We need to know the height of the container to know exactly where 'bottom' is in pixels relative to note 'y'
        // For now, let's assume the target is at HIT_Y_THRESHOLD approx.
        
        const hitNoteIndex = notesRef.current.findIndex(n => 
            n.value === targetValue && 
            Math.abs(n.y - HIT_Y_THRESHOLD) < HIT_WINDOW &&
            !n.hit
        );

        if (hitNoteIndex !== -1) {
            // HIT
            const note = notesRef.current[hitNoteIndex];
            note.hit = true;
            // Remove hit note immediately or animate it out?
            // For now, remove it to prevent double tapping
            notesRef.current.splice(hitNoteIndex, 1);
            setNotes([...notesRef.current]);

            triggerFeedback(targetValue, 'hit');
            if (targetValue === 'backspace') {
                setPin(prev => prev.slice(0, -1));
            } else if (pin.length < 6) {
                setPin(prev => prev + targetValue);
            }
        } else {
            // MISS
            triggerFeedback(targetValue, 'miss');
        }
    };

    const triggerFeedback = (num: number | 'backspace', type: 'hit' | 'miss') => {
        setFeedback(prev => ({ ...prev, [num]: type }));
        setTimeout(() => {
            setFeedback(prev => ({ ...prev, [num]: null }));
        }, 300);
    };

    useEffect(() => {
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, []);

    // Prevent keyboard input
    const handleKeyDown = (e: React.KeyboardEvent) => {
        e.preventDefault();
    };

    return (
        <Box className="rhythm-pin-container">
            <TextField
                {...textFieldProps}
                value={pin}
                onFocus={startGame}
                onBlur={(e) => {
                    // Slight delay to allow clicks on targets to register
                    // But if we use onMouseDown on targets, it might fire before blur
                    // Let's rely on the fact that game overlays might need to prevent default on mouseDown
                    if (!e.currentTarget.contains(e.relatedTarget)) {
                       stopGame();
                    }
                }}
                onKeyDown={handleKeyDown}
                className="dark-mode-text-field hidden-caret"
                inputProps={{ 
                    readOnly: true, // Also blocks mobile keyboard usually
                    inputMode: 'none' // Hints browsers not to show virtual keyboard
                }} 
                sx={{
                    '& .MuiInputBase-input': {
                        color: 'white',
                        textAlign: 'center',
                        letterSpacing: '0.5em',
                        fontSize: '1.5rem'
                    },
                }}
            />

            {gameActive && (
                <div 
                    className="rhythm-game-overlay"
                    ref={gameContainerRef}
                    onMouseDown={(e) => e.preventDefault()} // Update: Prevent focus loss
                >
                    <div className="rhythm-lane-container">
                        {lanes.map((num) => (
                            <div 
                                key={num} 
                                className={`rhythm-target-btn ${feedback[num] || ''}`}
                                onMouseDown={(e) => handleTargetClick(num, e)}
                                onTouchStart={(e) => handleTargetClick(num, e)}
                                style={{ margin: '0 auto' }}
                            >
                                {num === 'backspace' ? <Delete size={20} /> : num}
                            </div>
                        ))}
                    
                        {notes.map(note => {
                            // Calculate left position based on lane index
                            // We need to match the flexbox layout of lanes
                            // 11 lanes
                            const laneWidth = 100 / 11;
                            const leftPercent = (note.laneIndex * laneWidth) + (laneWidth / 2); 
                            
                            return (
                                <div
                                    key={note.id}
                                    className={`rhythm-note ${note.value === 'backspace' ? 'backspace-note' : ''}`}
                                    style={{
                                        top: `${note.y}px`,
                                        left: `${leftPercent}%`,
                                        transform: 'translateX(-50%)', // Center note on the left position
                                        backgroundColor: note.value === 'backspace' ? '#ef5350' : undefined 
                                    }}
                                >
                                    {note.value === 'backspace' ? <Delete size={16} /> : note.value}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </Box>
    );
}
