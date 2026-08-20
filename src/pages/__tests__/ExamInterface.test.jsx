import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ExamInterface from '../ExamInterface';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('ExamInterface', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    // ensure fresh localStorage
    localStorage.clear();
  });
  afterEach(() => jest.useRealTimers());

  test('starts exam and auto-submits after visibility violations', async () => {
    const { getByText } = render(<ExamInterface />);
    expect(getByText(/Ready to start your exam/i)).toBeInTheDocument();

    fireEvent.click(getByText(/Start exam/i));
    // after starting, question prompt should appear
    await waitFor(() => expect(screen.getByText(/Question 1 of/i)).toBeInTheDocument());

    // simulate visibility changes -> 3 violations should trigger submit
    Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true });
    fireEvent(document, new Event('visibilitychange'));
    fireEvent(window, new Event('blur'));
    fireEvent(document, new Event('visibilitychange'));
    fireEvent(window, new Event('blur'));
    fireEvent(document, new Event('visibilitychange'));

    // allow effects to run
    await waitFor(() => {
      const stored = JSON.parse(localStorage.getItem('examResults') || '[]');
      expect(stored.length).toBeGreaterThanOrEqual(1);
    });
  });
});
