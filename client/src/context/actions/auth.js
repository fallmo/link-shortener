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
    return { error: true };
  }
};

export const attemptLogin = async fields => {
  try {
    const response = await fetch(`${API}/auth/login`, {
      method: "POST",
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
