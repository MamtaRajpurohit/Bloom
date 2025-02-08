import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the chat header', () => {
  render(<App />);
  const linkElement = screen.getByText(/Chat Application/i);
  expect(linkElement).toBeInTheDocument();
});
