import axios from 'axios'

// Base URL for your API
const BASE_URL = 'http://localhost:5050' // Replace with your actual API base URL

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // Optional: sets a 10-second timeout
  headers: {
    'Content-Type': 'application/json', // Default content type
  },
})

// Optional: Add interceptors for request/response
api.interceptors.request.use(
  (config) => {
    // Example: Add an Authorization token to every request
    const token = localStorage.getItem('token') // Adjust as per your token storage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Example: Handle errors globally
    console.error('API error:', error)
    return Promise.reject(error)
  },
)

export default api
