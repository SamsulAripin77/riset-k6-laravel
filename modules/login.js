import http from 'k6/http';

export function login(BASE_URL, headers, userId, uniqueTimestamp, DEFAULT_TIMEOUT) {
    const loginPayload = JSON.stringify({
        email: `loli${userId}_${uniqueTimestamp}@gmail.com`,
        password: "dewil321",
    });

    return http.post(`${BASE_URL}/login`, loginPayload, {
        headers,
        timeout: DEFAULT_TIMEOUT,
    });
}
