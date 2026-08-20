import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChatRoom from '../ChatRoom';

class MockWebSocket {
  constructor(url) {
    this.url = url;
    MockWebSocket._last = this;
    this.listeners = {};
    setTimeout(() => {
      if (this.onopen) this.onopen();
    }, 0);
  }
  send() {}
  addEventListener(ev, cb) { this.listeners[ev] = cb; }
  removeEventListener(ev) { delete this.listeners[ev]; }
  close() {}
  // helper to simulate server message
  _push(data) {
    const ev = { data: JSON.stringify(data) };
    if (this.onmessage) this.onmessage(ev);
    if (this.listeners.message) this.listeners.message(ev);
  }
}

describe('ChatRoom', () => {
  beforeEach(() => {
    localStorage.clear();
    global.WebSocket = MockWebSocket;
    // enable the WS path in the component so the MockWebSocket is used
    global.__ENABLE_CHAT_WS = true;
  });
  afterEach(() => { delete global.WebSocket; });

  test('sends message on Enter and clears draft', async () => {
    render(<ChatRoom />);
    const input = screen.getByPlaceholderText(/Type a message/i);
    fireEvent.change(input, { target: { value: 'Hello team' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    await waitFor(() => expect(screen.getAllByText(/Hello team/).length).toBeGreaterThan(0));
    expect(localStorage.getItem('chatDraft:1') || '').toBe('');
  });

  test('receives websocket message and displays it', async () => {
    render(<ChatRoom />);
    // wait for mock websocket to be constructed
    await waitFor(() => expect(MockWebSocket._last).toBeDefined());
    const server = MockWebSocket._last;
    // server sends a message targeting room 1
    const payload = { roomId: 1, message: { id: 9999, from: 'Server', initials: 'SV', dark: false, time: '12:00', text: 'Server hello' } };
    server._push(payload);
    await waitFor(() => expect(screen.getByText(/Server hello/)).toBeInTheDocument());
  });
});
