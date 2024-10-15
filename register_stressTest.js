import { registerUser } from './modules/user.js';
import { Counter } from 'k6/metrics';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';

const BASE_URL = 'http://host.docker.internal:8000/api';
const registerCounterSuccess = new Counter("user_registration_counter_success");
const registerCounterError = new Counter("user_registration_counter_error");

export const options = {
    scenarios: {
        userRegistration: {
            executor: "ramping-arrival-rate",
            startRate: 10,
            timeUnit: '1s',
            stages: [
                { target: 100, duration: '1m' }, // Ramp up to 100 RPS
                { target: 0, duration: '1m' }, // Gradually return to 0 RPS
            ],
            preAllocatedVUs: 30,
            maxVUs: 100,
        },
    },
};

export default function stressTest() {
    const uniqueId = uuidv4();
    const registerRequest = {
        name: `user-${uniqueId}`,
        email: `user-${uniqueId}@example.com`,
        password: 'rahasia123',
        password_confirmation: 'rahasia123',
    };

    const response = registerUser(registerRequest, BASE_URL);
    if (response.status === 201) {
        registerCounterSuccess.add(1);
    } else {
        registerCounterError.add(1);
    }
}
