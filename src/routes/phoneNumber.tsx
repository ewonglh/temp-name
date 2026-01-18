import { createFileRoute } from '@tanstack/react-router'

import React, { useRef, useState } from 'react';
import { Stack, TextField, Button } from '@mui/material';

const actualNumber = 65161709;
var hi = 99999999;
var lo = 0;
function binSearch(hi: number, lo: number){
    return Math.floor(lo + (hi-lo)/2);
}


const PhoneNumber: React.FC = () => {
    const [phoneNumber, setHP] = useState(50000000);
    const [feedback, setFeedback] = useState('');
    const higherHandler = ()=>{
        lo = phoneNumber;
        setHP(binSearch(lo,hi));
    }
    const lowerHandler = () =>{
        hi = phoneNumber;
        setHP(binSearch(lo,hi));

    }
    const yesHandler = () => {
        //TODO
        if(actualNumber===phoneNumber){
            //success
            setFeedback("Yes it is :D");
        }else{
            reset();
            setFeedback("No it isnt >:|");

        }
    }
    const reset = () => {
        hi = 99999999;
        lo = 0;
        setHP(50000000);

    }
    
    
    return (
        <Stack 
            spacing = {3} 
            width = {300} 
            direction="column"
            sx = {{
                display: "flex",
                position: "relative",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                width: "100vw"
            }}
        >
            <TextField
                label = ""
                value = ""
            >

            </TextField>
            <TextField
                label = "Is this your phone number?"
                value = {phoneNumber}
            >   
            </TextField>
            <Stack direction = "row">
                <Button
                    variant='contained'
                    color = 'success'
                    onClick={higherHandler}
                >
                    Higher
                </Button>
                <Button
                    variant = 'contained'
                    color = 'warning'
                    onClick={yesHandler}
                >
                    Yes
                </Button>
                <Button
                    variant = 'contained'
                    color = 'error'
                    onClick={lowerHandler}
                >
                    Lower
                </Button>
            </Stack>
            <Button
                variant = 'contained'
                color = 'primary'
                onClick ={reset}
            >
                Reset
            </Button>
            <TextField
                value = {feedback}
                inputProps ={{readOnly: true}}  
                variant='filled'
            >

            </TextField>



        </Stack>
    );

}

export const Route = createFileRoute('/phoneNumber')({
  component: PhoneNumber,
})


export default PhoneNumber;
