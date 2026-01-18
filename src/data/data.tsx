const DATA_KEY = 'leaderboard_data';

interface User {
    time: number
    username: string
    combo: number
}

// Parse CSV string to User array
function parseCSV(csvString: string): User[] {
    const lines = csvString.trim().split('\n');
    const users: User[] = [];
    
    for (const line of lines) {
        if (!line.trim()) continue;
        const [timeStr, username, comboStr] = line.split(',');
        
        const time = parseFloat(timeStr);
        const combo = parseInt(comboStr);
        const trimmedUsername = username?.trim();

        // Filter out malformed or null entries
        if (!trimmedUsername || 
            trimmedUsername === 'null' || 
            trimmedUsername === '' || 
            isNaN(time) || 
            isNaN(combo)) {
            continue;
        }

        users.push({
            time,
            username: trimmedUsername,
            combo
        });
    }
    
    return users;
}

// Load hardcoded example data from CSV file
async function loadHardcodedData(): Promise<User[]> {
    try {
        const response = await fetch('/leaderboard-data.csv');
        if (!response.ok) return [];
        const csvText = await response.text();
        return parseCSV(csvText);
    } catch (error) {
        console.error('Error loading hardcoded data:', error);
        return [];
    }
}

// Load user data from localStorage and merge with hardcoded data
export async function loadUserData(): Promise<User[]> {
    try {
        // Load hardcoded examples
        const hardcodedData = await loadHardcodedData();
        
        // Load user data from localStorage
        const stored = localStorage.getItem(DATA_KEY);
        const userData = stored ? parseCSV(stored) : [];
        
        // Merge and sort by time
        const allData = [...hardcodedData, ...userData];
        return allData.sort((a, b) => a.time - b.time);
    } catch (error) {
        console.error('Error loading user data:', error);
        return [];
    }
}
