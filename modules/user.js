import http from 'k6/http';
import { check } from 'k6';

// Fungsi untuk mendaftarkan pengguna baru
export function registerUser(body, BASE_URL) {
    const registerResponse = http.post(`${BASE_URL}/register`, JSON.stringify(body), {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        timeout: '60s',
    });

    check(registerResponse, {
        'register response status must be 201': (response) => response.status === 201,
        'register response must contain user data': (response) => response.json('data') !== null,
    });

    return registerResponse;
}

// Fungsi untuk login
export function loginUser(body, BASE_URL) {
    const loginResponse = http.post(`${BASE_URL}/login`, JSON.stringify(body), {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        timeout: '50s',
    });

    check(loginResponse, {
        'login response status must be 200': (response) => response.status === 200,
        'login response must contain token': (response) => response.json('token') !== null,
    });


    return loginResponse;
}
