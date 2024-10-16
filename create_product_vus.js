import { loginUser,registerUser } from './modules/user.js';
import { Counter } from 'k6/metrics';
import { createProduct } from './modules/product.js';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';
import execution from "k6/execution";

const BASE_URL = 'http://host.docker.internal:8000/api'; // URL API
export const options = {
    scenarios: {
        createProductExec: {
            exec: "createProductExec",
            executor: "constant-vus", // Jumlah pengguna tetap
            vus: 10, // 50 virtual users
            duration: '30s', // Durasi tes 30 detik
        },
    },
    thresholds: {
        user_login_counter_success: ['count>90'],
        user_login_counter_error: ['count<10'],
        user_registration_counter_success: ['count>90'],
        user_registration_counter_error: ['count<10'],
        product_creation_counter_success: ['count>90'],
        product_creation_counter_error: ['count<10']
    }
};

const registerCounterSuccess = new Counter("user_registration_counter_success");
const registerCounterError = new Counter("user_registration_counter_error");
const loginCounterSuccess = new Counter("user_login_counter_success");
const loginCounterError = new Counter("user_login_counter_error");
const productCreationCounterSuccess = new Counter("product_creation_counter_success");
const productCreationCounterError = new Counter("product_creation_counter_error");

let registeredUsers = [];

export function createProductExec() {

    const uniqueId = uuidv4();
    const email = `user-${uniqueId}@example.com`;
    const registerRequest = {
        name: `user-${uniqueId}`,
        email: email,
        password: 'rahasia123',
        password_confirmation: 'rahasia123',
    };

    const registerResponse = registerUser(registerRequest, BASE_URL);
    if (registerResponse.status === 201) {
        registerCounterSuccess.add(1);
        registeredUsers.push(email);
    } else {
        registerCounterError.add(1);
    }

    const loginRequest = {
        email: email,
        password: 'rahasia123',
    }

    const loginResponse = loginUser(loginRequest, BASE_URL);

    if (loginResponse.status === 200) {
        loginCounterSuccess.add(1);
        // Jika login berhasil, buat produk
        const token = loginResponse.json().user.token; // Ambil token dari respons login
        const userId = loginResponse.json().user.id;  // Misalnya user.id tersedia di data
        const productId = Math.floor(Math.random() * 1000); // ID produk acak untuk demonstrasi
        const headers = {
            'Content-Type': 'application/json',
        };

        // const productResponse = createProduct(BASE_URL, headers, token, userId, productId);
        // if (productResponse.status === 201) {
        //     productCreationCounterSuccess.add(1);
        // } else {
        //     productCreationCounterError.add(1);
        // }
    } else {
        loginCounterError.add(1);
    }
}