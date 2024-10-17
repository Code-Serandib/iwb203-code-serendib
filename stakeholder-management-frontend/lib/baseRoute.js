import axios from 'axios';

const baseRoute = axios.create({
  baseURL: 'http://localhost:9091', // Set your base URL here
  headers: {
    'Content-Type': 'application/json',
  },
});

export default baseRoute;