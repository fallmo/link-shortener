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
