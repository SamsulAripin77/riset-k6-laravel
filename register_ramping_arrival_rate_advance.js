import { registerUser } from './modules/user.js';
import { Counter } from 'k6/metrics';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';

const BASE_URL = 'http://host.docker.internal:8000/api'; // URL API

export const options = {
    scenarios: {
        userRegistration: {
            exec: "userRegistration",
            executor: "ramping-arrival-rate", // Menggunakan ramping untuk melihat batas kapasitas
            startRate: 20, // Mulai dari 20 request per detik
            timeUnit: '1s', // Setiap detik
            stages: [
                { target: 100, duration: '30s' }, // Naik menjadi 100 request per detik selama 1 menit
                { target: 200, duration: '30s' }, // Naik menjadi 200 request per detik selama 1 menit
                { target: 300, duration: '30s' }, // Naik menjadi 300 request per detik selama 1 menit
                { target: 400, duration: '30s' }, // Naik menjadi 400 request per detik selama 1 menit
                { target: 500, duration: '30s' }, // Naik menjadi 500 request per detik selama 1 menit
            ],
            preAllocatedVUs: 50, // Pengguna virtual awal yang disiapkan
            maxVUs: 500, // Pengguna virtual maksimum
        }
    },
    thresholds: {
        user_registration_counter_success: ['count>90'],
        user_registration_counter_error: ['count<10'],
        'dropped_iterations': ['rate<0.05'], // Maksimum 5% dropped iterations
        http_req_duration: ['p(95)<3000'], // 95% request harus di bawah 3 detik
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
