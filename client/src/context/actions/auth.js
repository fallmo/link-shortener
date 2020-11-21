import { API } from "./constants";

export const checkAuth = async () => {
  await sleep(1000);
  try {
    const token = localStorage.getItem("@token");
    if (!token) return {};
    const response = await fetch(`${API}/auth/user`, {
      method: "GET",
      headers: {
        "token": token,
      },
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return { user: data.data };
  } catch (err) {
    if (err.message === "Token Expired" && (await refreshToken())) {
      return await checkAuth();
    } else {
      localStorage.removeItem("@token");
      return { error: true };
    }
  }
};

export const attemptLogin = async fields => {
  await sleep(1000);
  try {
    const response = await fetch(`${API}/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fields),
    });
    const data = await response.json();
    if (!data.success) return { error: data.message };
    else return { data: data.data };
  } catch (err) {
    return { error: "Failed to make request." };
  }
};

export const attemptSignup = async fields => {
  await sleep(1000);
  try {
    if (fields.password !== fields.password2)
      return { error: "Passwords do not match" };
    const response = await fetch(`${API}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fields),
    });
    const data = await response.json();
    if (!data.success) return { error: data.message };
    else return { success: data.data };
  } catch (err) {
    return { error: "Failed to make request." };
  }
};

export const attemptResend = async email => {
  await sleep(1000);
  try {
    const response = await fetch(`${API}/auth/resend`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    if (!data.success) return { error: data.message };
    return { success: data.data };
  } catch (err) {
    return { error: "Failed to make request" };
  }
};

export const attemptLogout = async () => {
  await sleep(1000);
  await fetch(`${API}/auth/logout`, {
    credentials: "include",
  });
  return;
};

export const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem("@refreshToken");
    if (!refreshToken) throw { message: "No refresh token" };
    const response = await fetch(`${API}/auth/refresh`, {
      credentials: "include",
      headers: {
        "refresh": refreshToken,
      },
    });
    const data = await response.json();
    if (!data.success) throw { message: data.message };
    localStorage.setItem("@token", data.data.token);
    return true;
  } catch (err) {
    localStorage.removeItem("@refreshToken");
    return false;
  }
};

const sleep = async ms => {
  return await new Promise(resolve => setTimeout(() => resolve(), ms));
};
