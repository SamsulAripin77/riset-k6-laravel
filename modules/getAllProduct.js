import http from 'k6/http';

export function getAllProducts(BASE_URL, headers, DEFAULT_TIMEOUT) {
    return http.get(`${BASE_URL}/products`, {
        headers,
        timeout: DEFAULT_TIMEOUT,
    });
}
