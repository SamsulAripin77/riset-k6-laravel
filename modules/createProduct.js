import http from 'k6/http';

export function createProduct(BASE_URL, headers, token, userId, productId, DEFAULT_TIMEOUT) {
    const productPayload = JSON.stringify({
        name: `lolipop ${productId} by loli ${userId}`,
        price: 20000 + (productId * 20000),
    });

    return http.post(`${BASE_URL}/products`, productPayload, {
        headers: {
            ...headers,
            'Authorization': `Bearer ${token}`,
        },
        timeout: DEFAULT_TIMEOUT,
    });
}
