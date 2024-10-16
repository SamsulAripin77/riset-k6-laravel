import http from 'k6/http';

export function createProduct(BASE_URL, headers, token, userId, productId) {
    const productPayload = JSON.stringify({
        name: `lolipop ${productId} by loli ${userId}`,
        price: 20000 + (productId * 20000),
    });

    const registerResponse = http.post(`${BASE_URL}/products`, productPayload, {
        headers: {
            ...headers,
            'Authorization': `Bearer ${token}`,
        },
    });

    check(registerResponse, {
        'register response status must be 201': (response) => response.status === 201,
        'register response must contain user data': (response) => response.json('data') !== null,
    });

    return registerResponse;
}
