import http from 'k6/http';

export function getProduct(BASE_URL, headers, productId, DEFAULT_TIMEOUT) {
    return http.get(`${BASE_URL}/products/${productId}`, {
        headers,
        timeout: DEFAULT_TIMEOUT,
    });
}
