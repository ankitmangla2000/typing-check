import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  // const linkElement = screen.getByText(/Let's test your typing skills /i);
  // expect(linkElement).toBeInTheDocument();
});
