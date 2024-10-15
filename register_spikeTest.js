import { registerUser } from './modules/user.js';
import { Counter } from 'k6/metrics';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';

const BASE_URL = 'http://host.docker.internal:8000/api'; // URL API

export const options = {
    scenarios: {
        spikeTest: {
            executor: "ramping-arrival-rate", // Menggunakan ramping-arrival-rate executor
            startRate: 10, // Mulai dengan 10 pengguna per detik
            timeUnit: '1s',
            stages: [
                { target: 10, duration: '10s' }, // Meningkatkan dari 0 hingga 10 pengguna per detik dalam 10 detik
                { target: 1000, duration: '10s' }, // Lonjakan mendadak hingga 100 pengguna per detik dalam 10 detik
                { target: 10, duration: '10s' }, // Menurun kembali ke 10 pengguna per detik
                { target: 0, duration: '10s' }, // Menghentikan semua pengguna dalam 10 detik
            ],
            preAllocatedVUs: 500, // Pre-allocated VUs untuk menghindari keterlambatan saat lonjakan
            maxVUs: 1000, // Batas maksimal VUs
        }
    },
    thresholds: {
        http_req_duration: ['p(95)<3000'], // Pastikan 95% dari permintaan memiliki durasi di bawah 3 detik
        'user_registration_counter_error': ['count<10'], // Jumlah kesalahan harus di bawah 10
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

// Ekspor fungsi sebagai default
export default userRegistration;
