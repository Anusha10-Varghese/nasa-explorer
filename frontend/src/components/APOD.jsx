// frontend/src/components/APOD.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoadingSpinner from './LoadingSpinner.jsx';

// Step 1: Import the date picker component and its required CSS
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const APOD = () => {
  const [apodData, setApodData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Step 2: Create state to hold the user's selected date
  const [selectedDate, setSelectedDate] = useState(new Date());

  // This `useEffect` hook now depends on `selectedDate`.
  // It will automatically re-run whenever the user picks a new date.
  useEffect(() => {
    const fetchAPOD = async () => {
      setLoading(true);
      setError(null);

      // Format the date into YYYY-MM-DD for the API
      const formattedDate = selectedDate.toISOString().split('T')[0];

      try {
        // Step 3: Pass the formatted date to our backend API
        const response = await axios.get('/api/apod', {
          params: { date: formattedDate }
        });
        setApodData(response.data);
      } catch (err) {
        // Handle the specific error when a user selects a date in the future
        if (err.response && (err.response.status === 400 || err.response.status === 404)) {
            setError('You can only select today or a date in the past. No pictures from the future... yet!');
        } else {
            setError('Could not fetch the Picture of the Day. Please try again later.');
        }
        setApodData(null); // Clear any old data if an error occurs
      } finally {
        setLoading(false);
      }
    };

    fetchAPOD();
  }, [selectedDate]);

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1rem' }}>
        <h2>Astronomy Picture of the Day</h2>
        
        {/* Step 4: Add the DatePicker component to the UI */}
        <div>
          <label htmlFor="apod-date-picker" style={{ marginRight: '10px', fontWeight: 'bold' }}>Select a Date:</label>
          <DatePicker 
            id="apod-date-picker"
            selected={selectedDate} 
            onChange={(date) => setSelectedDate(date)} // This updates the state, triggering the useEffect
            dateFormat="yyyy-MM-dd"
            maxDate={new Date()} // Prevents selecting future dates
            className="filters" // Reuse a style from our CSS for consistency
            popperPlacement="bottom-end"
          />
        </div>
      </div>

      {loading && <LoadingSpinner />}
      {error && <div className="error-message">{error}</div>}
      
      {apodData && (
        <article>
          <h3>{apodData.title}</h3>
          {apodData.media_type === 'image' ? (
            <img src={apodData.hdurl || apodData.url} alt={apodData.title} style={{ maxWidth: '100%', borderRadius: '8px' }} />
          ) : (
            <iframe
              src={apodData.url}
              title={apodData.title}
              style={{ width: '100%', aspectRatio: '16 / 9', border: 'none', borderRadius: '8px' }}
              allowFullScreen
            ></iframe>
          )}
          <p style={{ marginTop: '1.5rem' }}>{apodData.explanation}</p>
        </article>
      )}
    </div>
  );
};

export default React.memo(APOD);