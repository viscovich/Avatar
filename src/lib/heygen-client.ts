import axios from 'axios';

const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY;

if (!HEYGEN_API_KEY) {
  console.warn('HEYGEN_API_KEY is not set in environment variables.');
}

export const heygenClient = axios.create({
  baseURL: 'https://api.heygen.com',
  headers: {
    'X-Api-Key': HEYGEN_API_KEY,
    'Content-Type': 'application/json',
  },
});
