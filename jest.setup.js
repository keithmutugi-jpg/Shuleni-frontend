import '@testing-library/jest-dom/extend-expect';

// quick global mocks
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query) => ({ matches: false, media: query, addListener: () => {}, removeListener: () => {} }),
});
