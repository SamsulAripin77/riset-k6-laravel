import { registerUser } from './modules/user.js';
import { Counter } from 'k6/metrics';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';

const BASE_URL =  'http://host.docker.internal:8000/api'; // URL API

export const options = {
    scenarios: {
        userRegistration: {
            exec: "userRegistration",
            executor: "", // Cocok untuk uji beban registrasi
            vus: 20, // 50 virtual users
            iterations: 500, // Total 1000 registrasi
            maxDuration: '30s', // Batas waktu maksimum 1 menit
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

const users = []; // Simpan pengguna yang terdaftar

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
        users.push({
            email: registerRequest.email, // Simpan email untuk login
            password: registerRequest.password, // Simpan password
        });
    } else {
        registerCounterError.add(1);
    }
}