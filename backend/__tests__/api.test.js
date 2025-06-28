// backend/__tests__/api.test.js

// Mock axios *before* anything else. This is crucial.
// It replaces the real `axios` with a fake "mock" version for all tests in this file.
const axios = require('axios');
jest.mock('axios');

const request = require('supertest');
const express = require('express');

// We create a simplified version of our server app for isolated testing.
const app = express();
const NASA_API_URL = 'https://api.nasa.gov';
const NASA_API_KEY = 'TEST_KEY_DO_NOT_USE_REAL'; // Use a dummy key for tests

// Re-implement the APOD route logic here for the test environment
app.get('/api/apod', async (req, res) => {
    try {
        const { date } = req.query;
        const params = { api_key: NASA_API_KEY, ...(date && { date: date }) };
        const response = await axios.get(`${NASA_API_URL}/planetary/apod`, { params });
        res.json(response.data);
    } catch (error) {
        if (error.response) {
            return res.status(error.response.status).json(error.response.data);
        }
        res.status(500).json({ message: 'Failed to fetch data from NASA API.' });
    }
});

// The main test suite for our API
describe('Backend API: GET /api/apod', () => {

    // Clear all mock states before each test to ensure they don't interfere with each other
    afterEach(() => {
        jest.clearAllMocks();
    });

    // Test 1: The "happy path" - a successful request
    test('should return APOD data and a 200 status when the NASA API call is successful', async () => {
        const mockApodData = { title: 'Test Picture', explanation: 'A test explanation.' };
        
        // Instruct our mock axios to return a successful response with our mock data
        axios.get.mockResolvedValue({ data: mockApodData });

        // Use supertest to make a request to our test app's endpoint
        const response = await request(app).get('/api/apod');

        // Assertions: Check if the response is what we expect
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(mockApodData);
        // Ensure our mock was called correctly
        expect(axios.get).toHaveBeenCalledTimes(1);
    });

    // Test 2: The "error path" - NASA's API fails
    test('should return a 500 status when the NASA API call fails', async () => {
        // Instruct our mock axios to simulate a network failure
        axios.get.mockRejectedValue(new Error('Network Error'));

        const response = await request(app).get('/api/apod');

        // Assertions: Check for the 500 status and the correct error message
        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({ message: 'Failed to fetch data from NASA API.' });
    });
});