import { registerUser } from './modules/user.js';
import { Counter } from 'k6/metrics';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';

const BASE_URL = 'http://host.docker.internal:8000/api'; // URL API

export const options = {
    scenarios: {
        userRegistration: {
            exec: "userRegistration",
            executor: "ramping-arrival-rate", // Menggunakan ramping-arrival-rate
            startRate: 10, // Mulai dengan 10 iterasi per detik
            timeUnit: '1s',
            stages: [
                { target: 20, duration: '5s' }, // Tingkatkan hingga 20 iterasi per detik dalam 1 menit
                { target: 30, duration: '5s' }, // Lanjutkan hingga 30 iterasi per detik selama 1 menit
                { target: 40, duration: '5s' }, // Akhirnya sampai ke 50 iterasi per detik selama 1 menit
                { target: 50, duration: '5s' }, // Turunkan beban secara bertahap
                { target: 60, duration: '5s' }, // Turunkan beban secara bertahap
                { target: 70, duration: '5s' }, // Turunkan beban secara bertahap
                { target: 80, duration: '10s' }, // Turunkan beban secara bertahap
                { target: 90, duration: '10s' }, // Turunkan beban secara bertahap
                { target: 100, duration: '10s' }, // Turunkan beban secara bertahap
            ],
            preAllocatedVUs: 30, // Menurunkan pre-allocated VUs
            maxVUs: 100, // Batas maksimal VUs tetap 100
        }
    },
    thresholds: {
        user_registration_counter_success: ['count>90'], // Harus ada lebih dari 90 pendaftaran sukses
        user_registration_counter_error: ['count<10'], // Error harus di bawah 10
        'dropped_iterations': ['rate<0.05'], // Kurangi dropped iterations
        http_req_duration: ['p(95)<3000'], // Pastikan 95% dari permintaan memiliki durasi di bawah 3 detik
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
