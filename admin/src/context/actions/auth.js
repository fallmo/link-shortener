import { API } from "./constants";

export const checkAuth = async () => {
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

export const attemptLogout = async () => {
  await fetch(`${API}/auth/logout`, {
    credentials: "include",
  });
  return;
};

export const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem("@refreshToken");
    if (!refreshToken) throw new Error("No refresh token");
    const response = await fetch(`${API}/auth/refresh`, {
      credentials: "include",
      headers: {
        "refresh": refreshToken,
      },
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    localStorage.setItem("@token", data.data.token);
    return true;
  } catch (err) {
    localStorage.removeItem("@refreshToken");
    return false;
  }
};

export const getLogs = async () => {
  try {
    const response = await fetch(`${API}/admin/logs`, {
      headers: {
        "token": localStorage.getItem("@token"),
      },
    });
    const data = await response.json();
    if (!data.success) {
      if (data.message === "Token Expired") {
        if (await refreshToken()) return await getLogs();
        else return { error: "Authorization Expired" };
      } else {
        return { error: data.message };
      }
    }
    return { data: data.data };
  } catch (err) {
    return { error: "Failed to make request" };
  }
};

const sleep = async ms => {
  return await new Promise(resolve => setTimeout(() => resolve(), ms));
};
