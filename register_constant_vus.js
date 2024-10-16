import { registerUser } from './modules/user.js';
import { Counter } from 'k6/metrics';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';

const BASE_URL = 'http://host.docker.internal:8000/api'; // URL API
export const options = {
    scenarios: {
        userRegistration: {
            exec: "userRegistration",
            executor: "constant-vus", // Jumlah pengguna tetap
            vus: 50, // 50 virtual users
            duration: '30s', // Durasi tes 30 detik
        }
    },
    thresholds: {
        user_registration_counter_success: ['count>90'],
        user_registration_counter_error: ['count<10'],
    }
};

// Metrik counter untuk mengukur jumlah berhasil/gagal
const registerCounterSuccess = new Counter("user_registration_counter_success");
const registerCounterError = new Counter("user_registration_counter_error");

export function userRegistration() {
    const uniqueId = uuidv4();
    const registerRequest = {
        name: `user-${uniqueId}`,
        email: `user-${uniqueId}@example.com`,
        password: 'rahasia123',
        password_confirmation: 'rahasia123',
    };

    const response = registerUser(registerRequest, BASE_URL);
    if (response.status === 201) {
        registerCounterSuccess.add(1);
    } else {
        registerCounterError.add(1);
    }
}
