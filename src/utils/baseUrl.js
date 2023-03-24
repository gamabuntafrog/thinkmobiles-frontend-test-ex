
const prodUrl = 'https://thinkmobiles-backend-test-ex-production.up.railway.app/';
const devUrl = 'http://localhost:3001/';

const baseUrl = import.meta.env.DEV ? devUrl : prodUrl;

export default baseUrl;