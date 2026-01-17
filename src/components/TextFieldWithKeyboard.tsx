import { useState, useRef, useEffect } from 'react';
import { TextField } from '@mui/material';
import type { TextFieldProps } from '@mui/material';
import Keyboard, { initialKeyboardRows } from './Keyboard';
import '../theme/DarkModeTheme.css';

export default function TextFieldWithKeyboard(props: TextFieldProps) {
    const [textValue, setTextValue] = useState('');
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [keyboardLayout, setKeyboardLayout] = useState(initialKeyboardRows);
    const textFieldRef = useRef<HTMLDivElement>(null);
    const keyboardRef = useRef<HTMLDivElement>(null);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        e.preventDefault();
    };

    const handleKeyboardMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        textFieldRef.current?.querySelector('input')?.focus();
    };

    useEffect(() => {
        if (keyboardVisible && keyboardRef.current) {
            const keyboardHeight = keyboardRef.current.offsetHeight;
            document.body.style.paddingBottom = `${keyboardHeight}px`;
            document.documentElement.style.paddingBottom = `${keyboardHeight}px`;
            
            // Scroll the input field into view
            setTimeout(() => {
                const input = textFieldRef.current?.querySelector('input');
                if (input) {
                    input.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 100);
        } else {
            document.body.style.paddingBottom = '';
            document.documentElement.style.paddingBottom = '';
        }

        return () => {
            document.body.style.paddingBottom = '';
            document.documentElement.style.paddingBottom = '';
        };
    }, [keyboardVisible]);

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
                className="dark-mode-text-field"
            />
            {keyboardVisible && (
                <div ref={keyboardRef} onMouseDown={handleKeyboardMouseDown}>
                    <Keyboard 
                        value={textValue} 
                        onChange={setTextValue}
                        currentLayout={keyboardLayout}
                        onLayoutChange={setKeyboardLayout}
                    />
                </div>
            )}
        </> 
    );
}