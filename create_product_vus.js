import { loginUser,registerUser } from './modules/user.js';
import { Counter } from 'k6/metrics';
import { createProduct } from './modules/product.js';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';
import execution from "k6/execution";
import { check, sleep } from 'k6';

const BASE_URL = 'http://host.docker.internal:8000/api'; // URL API
export const options = {
    scenarios: {
        createProductExec: {
            exec: "createProductExec",
            executor: 'constant-vus',
            vus: 10,
            duration: '1m',
            gracefulStop: '10s'
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

export function createProductExec() {

    const userId = __VU;
    const uniqueTimestamp = Math.floor(Date.now() / 1000);
    const email = `loli${userId}_${uniqueTimestamp}@gmail.com`;
    const registerRequest = {
        name: `user-${userId}`,
        email: email,
        password: 'rahasia123',
        password_confirmation: 'rahasia123',
    };

    const registerResponse = registerUser(registerRequest, BASE_URL);
    if (registerResponse.status === 201) {
        registerCounterSuccess.add(1);
    } else {
        registerCounterError.add(1);
    }

    if(!registerResponse){
        console.log("register error")
        return
    }

    const loginRequest = {
        email: email,
        password: 'rahasia123',
    }

    const loginResponse = loginUser(loginRequest, BASE_URL);

    if(!loginResponse){
        console.log("logine eror : ")
        return
    }

    if (loginResponse.status === 200) {
        loginCounterSuccess.add(1);
    } else {
        loginCounterError.add(1);
    }

    const token = loginResponse.json('token'); // Ambil token dari respons login
    const loginUserId = loginResponse.json().user.id;  // Misalnya user.id tersedia di data
    if (!token) {
        console.log(`Token not received for VU ${loginUserId}`);
        return;
    }

    for (let i = 1; i <= 3; i++) {
        const productResponse = createProduct(BASE_URL, token, loginUserId, i);
        if (productResponse.status === 201) {
            productCreationCounterSuccess.add(1);
        } else {
            productCreationCounterError.add(1);
        }
    }
    sleep(2);
}