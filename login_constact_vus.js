import { loginUser, registerUser } from './modules/user.js';
import { SharedArray } from 'k6/data';
import { Counter } from 'k6/metrics';

// Memuat data dari file JSON sekali saja dan berbagi antar VU
const users = new SharedArray('users', function () {
  return JSON.parse(open('./data.json')); // File harus berisi array
});

const BASE_URL = 'http://host.docker.internal:8000/api'; // URL API
export const options = {
    scenarios: {
        userLogin: {
            exec: "userLogin",
            executor: "constant-vus", // Jumlah pengguna tetap
            vus: 50, // 50 virtual users
            duration: '10s', // Durasi tes 30 detik
        }
    },
    thresholds: {
        user_login_counter_success: ['count>90'],
        user_login_counter_error: ['count<10'],
    }
};

const loginCounterSuccess = new Counter("user_login_counter_success");
const loginCounterError = new Counter("user_login_counter_error");
const registerCounterSuccess = new Counter("user_registration_counter_success");
const registerCounterError = new Counter("user_registration_counter_error");

export function userLogin() {
    const user = users[Math.floor(Math.random() * users.length)];
    const loginRequest = {
        email: user.email,
        password: 'rahasia123',
    };

    const response = loginUser(loginRequest, BASE_URL);

    if (response.status === 200) {
        loginCounterSuccess.add(1);
    } else {
        loginCounterError.add(1);
    }
}
