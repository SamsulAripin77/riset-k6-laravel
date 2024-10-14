import fs from 'fs';

const USERS_FILE = 'users.json';

// Fungsi untuk membaca pengguna dari file
export function readUsersFromFile() {
    if (fs.existsSync(USERS_FILE)) {
        const data = fs.readFileSync(USERS_FILE);
        return JSON.parse(data);
    }
    return [];
}

// Fungsi untuk menulis pengguna ke file
export function writeUsersToFile(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}
