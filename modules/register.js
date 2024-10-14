import http from 'k6/http';

export function register(BASE_URL, headers, userId, uniqueTimestamp, DEFAULT_TIMEOUT) {
    const registerPayload = JSON.stringify({
        name: `loli${userId}`,
        email: `loli${userId}_${uniqueTimestamp}@gmail.com`,
        password: "dewil321",
        password_confirmation: "dewil321",
    });

    return http.post(`${BASE_URL}/register`, registerPayload, {
        headers,
        timeout: DEFAULT_TIMEOUT,
    });
}
