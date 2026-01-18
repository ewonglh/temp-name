import { createFileRoute } from '@tanstack/react-router'

import React, { useRef, useState } from 'react';
import { Stack, TextField, Button } from '@mui/material';

const MORSE_CODE: { [key:string]: string}  = {
  '.-': 'A',
  '-...': 'B',
  '-.-.': 'C',
  '-..': 'D',
  '.': 'E',
  '..-.': 'F',
  '--.': 'G',
  '....': 'H',
  '..': 'I',
  '.---': 'J',
  '-.-': 'K',
  '.-..': 'L',
  '--': 'M',
  '-.': 'N',
  '---': 'O',
  '.--.': 'P',
  '--.-': 'Q',
  '.-.': 'R',
  '...': 'S',
  '-': 'T',
  '..-': 'U',
  '...-': 'V',
  '.--': 'W',
  '-..-': 'X',
  '-.--': 'Y',
  '--..': 'Z',
  '-----': '0',
  '.----': '1',
  '..---': '2',
  '...--': '3',
  '....-': '4',
  '.....': '5',
  '-....': '6',
  '--...': '7',
  '---..': '8',
  '----.': '9',
  '/': ' ',
  ' ':'',
  '':''
};

function morseToText(morse: string) {
  try{
    const trimmed = morse.trim();
    if(trimmed === '')return '';
    const words = trimmed.split("/");
    const translated = words.map((word)=>{
      const letters = word.split(' ');
      const translatedLetters = letters.map((letter) =>{
        if(!MORSE_CODE[letter]&&letter!==''){
          throw new Error("bad input");
          return "-1";
        }
        return MORSE_CODE[letter];
      })
      return translatedLetters.join('');
    })  
    return translated.join(' ');
  }catch(error){
    return "That's not morse code >:|";
  }
}

const Morse: React.FC = () => {
  const [morse, setMorse] = useState('');
  
  const [input, setInput] = useState('');
  const [morseTF, setMorseTF] = useState('Login');
  const [timeDelta, setTimeDelta] = useState(0);
  const pressStart = useRef(0);
  const timeRef = useRef<number|null>(null);

  const onMouseDown = () => {
    pressStart.current = Date.now();
    setTimeDelta(0);
    timeRef.current = window.setInterval(()=>{
      setTimeDelta((prev)=>prev+=100);
    },100);
    
  };
  const onMouseUp = () => {
    setMorseTF("Morse");
    const duration = Date.now() - pressStart.current;
    var toAdd = "";
    if(duration<500){
      toAdd = ".";
    }else if(duration >= 500 && duration < 1000){
      toAdd = "-";
    }else if(duration >= 1000 && duration <= 1500){
      toAdd = " ";
    }else{
      toAdd = "/";
    }
    const nextMorse = morse + toAdd;
    setMorse(nextMorse);
    setInput(morseToText(nextMorse));
    
   
    if(timeRef.current !== null){
      clearInterval(timeRef.current);
      timeRef.current = null;
    }

    
  }
  

  const clear = () => {
    setMorse("");
    setInput("");
  };

  const login = () => {
    console.log('Third button clicked');
  };

 
  return (
    <Stack spacing={3} width={300}
    sx = {{
      display: "flex",
      position: "relative",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      width: "100wh"

    }}
    >
      <TextField
        
      />
      <TextField
        label={morseTF}
        defaultValue="Output"
        variant="outlined"
        value={morse}
        inputProps ={{readOnly: true}}
        
      />

      <TextField
        label="Password"
        variant="outlined"
        value={input}
        
      />

      
      <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          color="primary"
          onMouseDown={onMouseDown}
          onMouseUp = {onMouseUp}
        >
          Press Me!
        </Button>

        <Button
          variant="outlined"
          color="secondary"
          onClick={clear}
        >
          Clear
        </Button>
        <TextField
          label = {timeDelta}
          variant = "filled"
          inputProps ={{readOnly: true}}
        
          
        ></TextField>
        
      </Stack>

      
      <Button
        variant="contained"
        color="success"
        onClick={login}
      >
        Login
      </Button>
    </Stack>
  );
};

export const Route = createFileRoute('/morse')({
  component: Morse,
})


export default Morse;
