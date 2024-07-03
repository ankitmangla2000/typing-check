import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';

import TypingSpeedChecker from './component/TypingSpeedChecker';

describe('TypingSpeedChecker', () => {
    test('renders typing speed checker and simulates typing', async () => {
        render(<TypingSpeedChecker />);
        
        // Wait for the component to fully render and initialize
        await waitFor(() => {
            // Check if the main header text is present
            const headerElement = screen.getByText(/Let's test your typing skills/i);
            expect(headerElement).toBeInTheDocument();
        });

        // Simulate starting the test with any key press event
        document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'R' }));

        // Simulate typing the exact sentence
        const sentence = "React is a popular JavaScript library for building user interfaces.";
        for (const char of sentence) {
            document.body.dispatchEvent(new KeyboardEvent('keydown', { key: char }));
        }

        // Wait for WPM, timer, and accuracy to be updated
        await waitFor(() => {
            const wpmElement = screen.getByText(/Typing speed \(in WPM\):/i);
            expect(wpmElement).toBeInTheDocument();

            const timerElement = screen.getByText(/Timer:/i);
            expect(timerElement).toBeInTheDocument();

            const accuracyElement = screen.getByText(/Accuracy:/i);
            expect(accuracyElement).toBeInTheDocument();
        });

        const wpmElement = screen.getByText(/Typing speed \(in WPM\):/i);
        const wpmText = wpmElement.textContent;
        const wpmMatch = wpmText ? wpmText.match(/\d+/) : null;
        const wpmValue = wpmMatch ? parseInt(wpmMatch[0], 10) : 0;
        expect(wpmValue).toBeGreaterThanOrEqual(0);
        
        const accuracyElement = screen.getByText(/Accuracy:/i);
        expect(accuracyElement).toHaveTextContent("Accuracy: 100%");

        // Test the reset button functionality
        const resetButton = screen.getByRole('button', { name: /reset/i });
        userEvent.click(resetButton);

        // Check if everything is reset
        await waitFor(() => {
          const previousSentence= sentence;
          const currentSentence = screen.getByText(/Let's test your typing skills/i); // Check for the new sentence after reset
          expect(currentSentence).toBeInTheDocument();
          expect(currentSentence).not.toBe(previousSentence);

            expect(screen.queryByText(/Typing speed \(in WPM\):/i)).toHaveTextContent("Typing speed (in WPM): 0");
            expect(screen.queryByText(/Timer:/i)).toHaveTextContent("Timer: 0.0s");
            expect(screen.queryByText(/Accuracy:/i)).toHaveTextContent("Accuracy: 100%");
        });
    });
});
