import { useState, useEffect } from 'react';
import './Keyboard.css';

interface KeyboardProps {
    value: string;
    onChange: (value: string) => void;
}

export default function Keyboard({ value, onChange }: KeyboardProps) {
    const initialKeyboardRows = [
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
    const [inputText, setInputText] = useState(value);
    const [isCaps, setIsCaps] = useState(false);
    const [isShift, setIsShift] = useState(false);
    const [keyboardRows, setKeyboardRows] = useState(initialKeyboardRows);

    useEffect(() => {
        onChange(inputText);
    }, [inputText, onChange]);

    useEffect(() => {
        setInputText(value);
    }, [value]);

    useEffect(() => {
        renderKeyUpdates();
    }, [inputText, isCaps, isShift]);

        const randomizeKeyboard = () => {
            const allKeys: { key: string; rowIndex: number }[] = [];
            initialKeyboardRows.forEach((row, rowIndex) => {
                row.forEach(key => {
                    allKeys.push({ key, rowIndex });
                });
            });

            for (let i = allKeys.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [allKeys[i], allKeys[j]] = [allKeys[j], allKeys[i]];
            }

            // Reconstruct rows with original sizes
            const randomized: string[][] = [];
            let keyIndex = 0;
            initialKeyboardRows.forEach((row) => {
                const newRow: string[] = [];
                for (let i = 0; i < row.length; i++) {
                    newRow.push(allKeys[keyIndex].key);
                    keyIndex++;
                }
                randomized.push(newRow);
            });
            return randomized;
        }

    const parseKeyText = (keyvalue : string) => {
        return keyvalue.includes('.') 
            ? (keyvalue.split('.').map((part, index) => (<span key={index}>{part}</span>))) 
            : keyvalue.includes('_') 
            ? (keyvalue.split('_').map((part, index) => (<span key={index}>{part}</span>)))
            : (<span>{keyvalue}</span>)
    }

    const renderKeyUpdates = () => {
        const keys = document.querySelectorAll('.key');
        keys.forEach((key) => {
            const firstSpanElement = key.querySelector('span:first-child');
            if (firstSpanElement && firstSpanElement.parentElement) {
                const keyText = (firstSpanElement as HTMLElement).innerText.toLowerCase();
                const keyType = key.getAttribute('data-keytype');
                firstSpanElement.parentElement.style.backgroundColor = (keyType === "shift" && isShift) || (keyType === "caps" && isCaps)
                ? 'blue'
                :  '#445760'

                if (!['shift', 'alt', 'ctrl', 'enter', 'caps lock', 'tab']
                    .includes(keyText)) {
                    (firstSpanElement as HTMLElement).innerText = 
                    ((isCaps && isShift) || (!isCaps && !isShift)) 
                    ? keyText.toLowerCase() : keyText.toUpperCase();
                }
            }
        })
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

    return (
        <div className='keyboard' onMouseDown={(e) => e.preventDefault()}>
            <div className="keyboardcontainer">
                <div className="container">
                    <div className="row">
                        {keyboardRows[0]
                        .map((keyvalue, index) => 
                        (
                            <div key={index} className='key' 
                                 data-keytype={keyvalue === 'Caps Lock' ? 'caps' : keyvalue === 'Shift' ? 'shift' : ''}
                                 onClick={() => handleKeyClick(keyvalue)}>
                                {parseKeyText(keyvalue)}
                            </div>
                        ))}
                    </div>
                    <div className="row">
                        {keyboardRows[1]
                        .map((keyvalue, index) => (
                            <div key={index} className='key' 
                                 data-keytype={keyvalue === 'Caps Lock' ? 'caps' : keyvalue === 'Shift' ? 'shift' : ''}
                                 onClick={() => handleKeyClick(keyvalue)}>
                                {parseKeyText(keyvalue)}
                            </div>
                        ))}
                    </div>
                    <div className="row">
                        {keyboardRows[2]
                            .map((keyvalue, index) => (
                            <div key={index} className='key' 
                                 data-keytype={keyvalue === 'Caps Lock' ? 'caps' : keyvalue === 'Shift' ? 'shift' : ''}
                                 onClick={() => handleKeyClick(keyvalue)}>
                                {parseKeyText(keyvalue)}
                            </div>
                        ))}
                    </div>
                    <div className="row">
                        {keyboardRows[3].map((keyvalue, index) => (
                            <div key={index} className='key' 
                                 data-keytype={keyvalue === 'Caps Lock' ? 'caps' : keyvalue === 'Shift' ? 'shift' : ''}
                                 onClick={() => handleKeyClick(keyvalue)}>
                                {parseKeyText(keyvalue)}
                            </div>
                        ))}
                    </div>
                    <div className="row">
                        {keyboardRows[4]
                            .map((keyvalue, index) => (
                            <div key={index} className='key'
                            data-keytype={keyvalue === 'Caps Lock' ? 'caps' : keyvalue === 'Shift' ? 'shift' : ''} 
                            onClick={() => handleKeyClick(keyvalue)}>
                                {parseKeyText(keyvalue)}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}