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
        const [time, username, combo] = line.split(',');
        users.push({
            time: parseFloat(time),
            username: username.trim(),
            combo: parseInt(combo)
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

// Save new user data to localStorage
export async function saveUserData(newUser: User): Promise<void> {
    try {
        // Load only user data from localStorage (not hardcoded data)
        const stored = localStorage.getItem(DATA_KEY);
        const existing = stored ? parseCSV(stored) : [];
        existing.push(newUser);
        
        // Convert to CSV format
        const csv = existing
            .map((user: User) => `${user.time},${user.username},${user.combo}`)
            .join('\n');
        
        localStorage.setItem(DATA_KEY, csv);
    } catch (error) {
        console.error('Error saving user data:', error);
    }
}
