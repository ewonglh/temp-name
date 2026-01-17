import { useState, useRef } from 'react';
import { TextField } from '@mui/material';
import type { TextFieldProps } from '@mui/material';
import Keyboard from './Keyboard';

export default function TextFieldWithKeyboard(props: TextFieldProps) {
    const [textValue, setTextValue] = useState('');
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const textFieldRef = useRef<HTMLDivElement>(null);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        e.preventDefault();
    };

    const handleKeyboardMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        textFieldRef.current?.querySelector('input')?.focus();
    };

    return (
        <>
            <TextField
                {...props}
                ref={textFieldRef}
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
                placeholder=""
                onFocus={() => setKeyboardVisible(true)}
                onBlur={() => setKeyboardVisible(false)}
                onKeyDown={handleKeyDown}
                sx={{
                    '& .MuiInputBase-input': {
                        color: 'white'
                    }
                }}
            />
            {keyboardVisible && <div onMouseDown={handleKeyboardMouseDown}><Keyboard value={textValue} onChange={setTextValue} /></div>}
        </> 
    );
}