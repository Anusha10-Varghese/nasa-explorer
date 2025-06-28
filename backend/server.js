// backend/server.js

// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5001;
const NASA_API_KEY = process.env.NASA_API_KEY;
const NASA_API_URL = 'https://api.nasa.gov';

// Critical Startup Check for API Key
if (!NASA_API_KEY || NASA_API_KEY === 'YOUR_KEY_HERE') {
  console.error('FATAL ERROR: NASA_API_KEY is not defined in the .env file.');
  console.error('The server cannot start without a valid API key.');
  process.exit(1); // Exit the process with an error code.
}

// Standard Middleware
app.use(cors());
app.use(express.json());

// --- UPDATED APOD ROUTE ---
// Route for Astronomy Picture of the Day (APOD)
app.get('/api/apod', async (req, res) => {
  try {
    // Check if a date was provided in the query from the frontend's date picker
    const { date } = req.query;

    // Build the parameters for the NASA API call dynamically
    const params = {
      api_key: NASA_API_KEY,
      // If a 'date' exists in the query, add it to the parameters.
      // This is the "spread if" syntax.
      ...(date && { date: date }) 
    };

    const response = await axios.get(`${NASA_API_URL}/planetary/apod`, { params });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching APOD from NASA API:', error.message);
    // If NASA's API returns a specific error (like 400 for a bad date),
    // forward that status and message to our frontend for better error handling.
    if (error.response) {
        return res.status(error.response.status).json(error.response.data);
    }
    // For all other errors, send a generic 500 status.
    res.status(500).json({ message: 'Failed to fetch data from NASA API.' });
  }
});

// Mars Rover Photos Route
app.get('/api/mars-rover', async (req, res) => {
  const { rover, sol, camera } = req.query;
  try {
    const response = await axios.get(`${NASA_API_URL}/mars-photos/api/v1/rovers/${rover}/photos`, {
      params: { sol, camera, api_key: NASA_API_KEY, page: 1 },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching Mars Rover Photos from NASA API:', error.message);
    res.status(500).json({ message: 'Failed to fetch data from NASA API.' });
  }
});

// Near Earth Objects (NeoWs) Route
app.get('/api/neows', async (req, res) => {
    const { start_date, end_date } = req.query;
    try {
        const response = await axios.get(`${NASA_API_URL}/neo/rest/v1/feed`, {
            params: { start_date, end_date, api_key: NASA_API_KEY },
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching NeoWs data from NASA API:', error.message);
        res.status(500).json({ message: 'Failed to fetch data from NASA API.' });
    }
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Backend server is running on http://localhost:${PORT}`);
});