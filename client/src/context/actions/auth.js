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
    localStorage.removeItem("@token");
    return { error: true };
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

export const attemptLogout = async () => {
  await sleep(1000);
  await fetch(`${API}/auth/logout`, {
    credentials: "include",
  });
  return;
};

const sleep = async ms => {
  return await new Promise(resolve => setTimeout(() => resolve(), ms));
};
