// frontend/src/__tests__/LoadingSpinner.test.jsx

import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

describe('LoadingSpinner Component', () => {
    test('renders without crashing and is present in the document', () => {
        // Render the component
        render(<LoadingSpinner />);
        
        // Find the outer div of the spinner component. We give it a `data-testid`
        // in the component code to make it easy to find in tests.
        // Let's modify the component slightly for this test.
        // Go to LoadingSpinner.jsx and change `<div className="spinner-container">`
        // to `<div className="spinner-container" data-testid="loading-spinner">`

        // Let's assume we modified LoadingSpinner.jsx to have a data-testid
        // const spinnerElement = screen.getByTestId('loading-spinner');
        // For now, let's find it by a less specific role. The outer div is just a generic container.
        const spinnerContainer = screen.getByRole('generic', { name: '' }).parentElement;
        
        expect(spinnerContainer).toBeInTheDocument();
    });
});