import { registerUser } from './modules/user.js';
import { Counter } from 'k6/metrics';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';

const BASE_URL = 'http://host.docker.internal:8000/api'; // URL API

export const options = {
    scenarios: {
        userRegistration: {
            exec: "userRegistration",
            executor: "constant-arrival-rate", // Pendaftaran pengguna dengan tingkat kedatangan tetap
            rate: 100, // 10 pendaftaran per detik
            timeUnit: '1s', // Setiap detik
            duration: '30s', // Durasi tes 30 detik
            preAllocatedVUs: 50, // Pengguna virtual yang disiapkan
            maxVUs: 100, // Pengguna virtual maksimum
        }
    },
    thresholds: {
        user_registration_counter_success: ['count>90'],
        user_registration_counter_error: ['count<10'],
        'dropped_iterations': ['rate<0.05'],
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
