import "@testing-library/jest-dom";

class MockResizeObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = MockResizeObserver;
