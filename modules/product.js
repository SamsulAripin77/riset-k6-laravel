import http from 'k6/http';
import { check, sleep } from 'k6';

export function createProduct(BASE_URL, token, userId, productId) {
    const productPayload = JSON.stringify({
        name: `lolipop ${productId} by loli ${userId}`,
        price: 20000 + (productId * 20000)
    });

    const createProductResponse = http.post(`${BASE_URL}/products`, productPayload, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        timeout: '50s',
    });

        

    check(createProductResponse, {
        'create product response status must be 201': (response) => response.status === 201,
        'create product response must contain user data': (response) => response.json('data') !== null,
    });

    return createProductResponse;
}
