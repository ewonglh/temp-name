import fs from 'fs'
import csv from 'csv-parser'

const filePath = 'data.json'

interface User {
    time : number
    username : string
    combo : number
}

export function loadUserData() {

    const output : User[] = [];

    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => 
            output.push({
            time : row[0], 
            username : row[1], 
            combo : row[2]
        }))
    
    return output;

}

export function saveUserData(newUser : User) {
    const values = Object.values(newUser);
    fs.appendFileSync(filePath, values.join(',') + '\n');
}
