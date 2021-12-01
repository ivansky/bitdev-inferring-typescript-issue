import { fireEvent } from '@testing-library/react';

const localStorageMock = (function () {
  let store = {};
  const createEvent = (key, newValue, oldValue) => {
    return new StorageEvent('storage', {
      key: key || null,
      newValue: newValue || null,
      oldValue: oldValue || null,
    });
  };

  return {
    getItem: function (key) {
      const value = store[key];
      fireEvent(window, createEvent(key, value, value));
      return value;
    },
    setItem: function (key, value) {
      const prevValue = store[key];
      store[key] = value.toString();
      fireEvent(window, createEvent(key, value, prevValue));
    },
    clear: function () {
      fireEvent(window, createEvent());
      store = {};
    },
    removeItem: function (key) {
      const prevValue = store[key];
      delete store[key];
      fireEvent(window, createEvent(key, null, prevValue));
    },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });
