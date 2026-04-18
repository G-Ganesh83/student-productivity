const TOKEN_STORAGE_KEY = "token";
const USER_STORAGE_KEY = "user";

const decodeBase64Url = (value) => {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = normalized.length % 4;
  const paddedValue =
    padding === 0 ? normalized : normalized.padEnd(normalized.length + (4 - padding), "=");

  return atob(paddedValue);
};

export const decodeTokenPayload = (token) => {
  if (!token) {
    return null;
  }

  const [, payload] = token.split(".");

  if (!payload) {
    return null;
  }

  try {
    return JSON.parse(decodeBase64Url(payload));
  } catch {
    return null;
  }
};

export const isTokenExpired = (token) => {
  const payload = decodeTokenPayload(token);

  if (!payload?.exp) {
    return true;
  }

  return payload.exp * 1000 <= Date.now();
};

export const getTokenExpiryDelay = (token) => {
  const payload = decodeTokenPayload(token);

  if (!payload?.exp) {
    return 0;
  }

  return Math.max(payload.exp * 1000 - Date.now(), 0);
};

export const getStoredToken = () => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);

  if (!token || isTokenExpired(token)) {
    return null;
  }

  return token;
};

export const getStoredUser = () => {
  try {
    const savedUser = localStorage.getItem(USER_STORAGE_KEY);
    return savedUser ? JSON.parse(savedUser) : null;
  } catch {
    return null;
  }
};

export const storeAuth = (token, user) => {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);

  if (user) {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    return;
  }

  localStorage.removeItem(USER_STORAGE_KEY);
};

export const clearStoredAuth = () => {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(USER_STORAGE_KEY);
};
