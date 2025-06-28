// frontend/src/__tests__/APOD.test.jsx

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import APOD from '../components/APOD.jsx';

// Mock external dependencies
jest.mock('axios');
jest.mock('react-datepicker', () => {
  // A simple mock for the date picker component
  return function DummyDatePicker({ selected, onChange }) {
    return (
      <input
        type="text"
        value={selected.toISOString().split('T')[0]}
        onChange={(e) => onChange(new Date(e.target.value))}
        data-testid="date-picker"
      />
    );
  };
});

describe('APOD Page Component', () => {
    // Clear mocks before each test
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('fetches and displays the APOD data successfully on load', async () => {
        const mockApodData = {
            title: 'Majestic Galaxy',
            explanation: 'A stunning view of a distant galaxy.',
            media_type: 'image',
            hdurl: 'http://example.com/galaxy.jpg',
            date: '2023-10-27',
        };
        axios.get.mockResolvedValue({ data: mockApodData });

        render(<APOD />);

        // Check for loading state first
        expect(screen.getByRole('generic', { name: '' }).parentElement).toBeInTheDocument();

        // Wait for the async data to be fetched and rendered
        await waitFor(() => {
            expect(screen.getByText('Majestic Galaxy')).toBeInTheDocument();
        });

        // Check if all content is rendered correctly
        expect(screen.getByText('A stunning view of a distant galaxy.')).toBeInTheDocument();
        expect(screen.getByAltText('Majestic Galaxy')).toHaveAttribute('src', 'http://example.com/galaxy.jpg');
    });

    test('displays an error message if the API call fails', async () => {
        // Configure the mock to simulate a network error
        axios.get.mockRejectedValue(new Error('API is down'));

        render(<APOD />);

        // Wait for the error message to appear
        const errorMessage = await screen.findByText(/Could not fetch the Picture of the Day/i);
        expect(errorMessage).toBeInTheDocument();
        
        // Ensure the loading spinner is gone
        expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });
});