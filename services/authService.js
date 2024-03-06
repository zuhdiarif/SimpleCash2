// authService.js

import axios from 'axios';

const API_BASE_URL = 'http://10.0.2.2:8080';

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, {
      email,
      password,
    });

    const { data } = response;

    console.log('API Response:', data);

    // Check if the response contains the expected structure
    if (data && data.data && data.data.token) {
      const token = data.data.token;
      return token;
    } else {
      console.error('Token not found in expected API response structure:', data);
      throw new Error('Invalid API response structure');
    }
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};