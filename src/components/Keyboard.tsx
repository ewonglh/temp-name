import { useState, useEffect } from 'react';
import './Keyboard.css';

interface KeyboardProps {
    value: string;
    onChange: (value: string) => void;
    currentLayout?: string[][];
    onLayoutChange?: (layout: string[][]) => void;
}

export const initialKeyboardRows = [
    ['~.`', '!.1', '@.2', '#.3', '$.4', '%.5', 
    '^.6', '&.7', '*.8', '(.9', ').0', '_.-', '+.=', 
    '<--'],
    ['Tab', 'q', 'w', 'e', 'r', 't', 'y',
    'u', 'i', 'o', 'p', '{_[', '}_]', '|_\\'],
    ['Caps Lock', 'a', 's', 'd', 'f', 'g', 'h', 
    'j', 'k', 'l', ':_;', `"_'`, 'Enter'],
    ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm',
    '<_,', '>_.', '?_/', 'Shift'],
    ['Ctrl', 'Alt', '␣', 'Ctrl', 'Alt', '<', '>']
];

export default function Keyboard({ value, onChange, currentLayout, onLayoutChange }: KeyboardProps) {
    const [inputText, setInputText] = useState(value);
    const [isCaps, setIsCaps] = useState(false);
    const [isShift, setIsShift] = useState(false);
    
    // Internal state is used if no props are provided, but we sync with props if they exist
    const [internalLayout, setInternalLayout] = useState(initialKeyboardRows);
    
    const keyboardRows = currentLayout || internalLayout;
    
    const setKeyboardRows = (newLayout: string[][]) => {
        setInternalLayout(newLayout);
        if (onLayoutChange) {
            onLayoutChange(newLayout);
        }
    };

    useEffect(() => {
        onChange(inputText);
    }, [inputText, onChange]);

    useEffect(() => {
        setInputText(value);
    }, [value]);



    const randomizeKeyboard = () => {
        // defined row capacities for the layout, one of them must be 7 (for spacebar row)
        // 60 total keys. Space is 1. 59 others.
        // Original caps: [14, 14, 13, 12, 7] = 60
        const rowCapacities = [14, 14, 13, 12, 7];
        
        // Shuffle capacities to randomize which row gets the spacebar (the one with 7)
        for (let i = rowCapacities.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [rowCapacities[i], rowCapacities[j]] = [rowCapacities[j], rowCapacities[i]];
        }

        const allKeys: string[] = [];
        let spaceKey = '␣';

        // Extract all keys
        initialKeyboardRows.forEach(row => {
            row.forEach(key => {
                if (key === '␣') {
                    spaceKey = key;
                } else {
                    allKeys.push(key);
                }
            });
        });

        // Shuffle all non-space keys
        for (let i = allKeys.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allKeys[i], allKeys[j]] = [allKeys[j], allKeys[i]];
        }

        const randomized: string[][] = [];
        let keyIndex = 0;

        rowCapacities.forEach(capacity => {
            const row: string[] = [];
            if (capacity === 7) {
                // This is the spacebar row
                // Add 6 random keys
                for (let i = 0; i < 6; i++) {
                    if (keyIndex < allKeys.length) {
                        row.push(allKeys[keyIndex]);
                        keyIndex++;
                    }
                }
                // Add spacebar
                row.push(spaceKey);
                // Shuffle this row so spacebar isn't always at the end
                for (let i = row.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [row[i], row[j]] = [row[j], row[i]];
                }
            } else {
                // Determine actual capacity needed if we ran out of keys? 
                // (Shouldn't happen if math is right)
                for (let i = 0; i < capacity; i++) {
                     if (keyIndex < allKeys.length) {
                        row.push(allKeys[keyIndex]);
                        keyIndex++;
                    }
                }
            }
            randomized.push(row);
        });
        
        return randomized;
    };

    const parseKeyText = (keyvalue : string) => {
        return keyvalue.includes('.') 
            ? (keyvalue.split('.').map((part, index) => (<span key={index}>{part}</span>))) 
            : keyvalue.includes('_') 
            ? (keyvalue.split('_').map((part, index) => (<span key={index}>{part}</span>)))
            : (<span>{keyvalue}</span>)
    }



    const handleKeyClick = (key : string) => {
        if (key === 'Enter') {
            handleEnterKey();
        } 
        else if(key === "Ctrl" || key === "Alt")
        {
        }else if (key === '␣') {
            handleSpaceKey();
        } else if (key === 'Caps Lock') {
            handleCapsLock();
        } else if (key === '<--') {
            handleDeleteKey();
        } else if (key === 'Shift') {
            handleShiftKey();
        } else if (key === 'Tab') {
            handleTabKey();
        } else {
            handleRegularKey(key);
            setKeyboardRows(randomizeKeyboard());
        }
    };
    const handleSpaceKey = () => {
        const newContent = inputText + '\u00A0';
        setInputText(newContent);
    };
    const handleEnterKey = () => {
        const newContent = inputText + '\n';
        setInputText(newContent);
    };
    const handleCapsLock = () => {
        const updatedCaps = !isCaps;
        setIsCaps(updatedCaps);
    };
    const handleTabKey = () => {
        const newContent = inputText + '    ';
        setInputText(newContent);
    };

    const handleDeleteKey = () => {
        if (inputText.length === 0) {
            return;
        }
        const newContent = inputText.slice(0, inputText.length - 1);
        setInputText(newContent);
    };

    const handleShiftKey = () => {
        const updatedShift = !isShift;
        setIsShift(updatedShift);
    }

    const handleRegularKey = (key : string) => {
        const keys = key.split(/[._]/);
        let newContent;
        if (keys.length > 1) {
            if (isShift) {
                if (keys.length === 3) {
                    if (keys[0] === '>') newContent = inputText + '>';
                    else newContent = inputText + '_';
                }
                else newContent = inputText + keys[0];
            } else {
                if (keys.length === 3) {
                    if (keys[0] === '>') newContent = inputText + '.';
                    else newContent = inputText + '-';
                }
                else newContent = inputText + keys[1];
            }
        } else {
            let character = ((isShift && isCaps) || (!isShift && !isCaps)) 
            ? key.toLowerCase() : key.toUpperCase();
            newContent = inputText + character;
        }
        setIsShift(false);
        setInputText(newContent);
    };

    const getKeyText = (key: string) => {
        if (['Shift', 'Alt', 'Ctrl', 'Enter', 'Caps Lock', 'Tab', '<--'].includes(key)) {
            return key;
        }
        return ((isCaps && isShift) || (!isCaps && !isShift)) 
            ? key.toLowerCase() 
            : key.toUpperCase();
    };

    const getKeyClass = (key: string) => {
        switch (key) {
            case '<--': return 'key-delete';
            case 'Enter': return 'key-enter';
            case 'Caps Lock': return 'key-caps';
            case 'Shift': return 'key-shift';
            case '␣': return 'key-space';
            case 'Ctrl':
            case 'Alt':
            case 'Tab':
            case '<':
            case '>':
                return 'key-meta';
            default: return '';
        }
    };

    return (
        <div className='keyboard' onMouseDown={(e) => e.preventDefault()}>
            <div className="keyboardcontainer">
                <div className="container">
                    {keyboardRows.map((row, rowIndex) => (
                        <div key={rowIndex} className="row">
                            {row.map((keyvalue, keyIndex) => {
                                const isActive = (keyvalue === 'Shift' && isShift) || (keyvalue === 'Caps Lock' && isCaps);
                                const specialClass = getKeyClass(keyvalue);
                                return (
                                    <div 
                                        key={keyIndex} 
                                        className={`key ${specialClass} ${isActive ? 'active' : ''}`}
                                        onClick={() => handleKeyClick(keyvalue)}
                                    >
                                        {parseKeyText(getKeyText(keyvalue))}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}