export const localStorage = {
  getItem: (key: string): string | null =>
    typeof window !== "undefined" ? window.localStorage.getItem(key) : null,
  setItem: (key: string, value: string): void => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(key, value);
    }
  },
  removeItem: (key: string): void => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(key);
    }
  },
};
