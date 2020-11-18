import { refreshToken } from "./auth";
import { API } from "./constants";

export const getLinks = async () => {
  try {
    const response = await fetch(`${API}/urls`, {
      headers: {
        "token": localStorage.getItem("@token"),
      },
    });
    const data = await response.json();
    if (!data.success) return { error: data.message };
    return { data: data.data };
  } catch (err) {
    return { error: "Failed to make request" };
  }
};

export const deleteLink = async _id => {
  try {
    const response = await fetch(`${API}/urls/${_id}`, {
      method: "DELETE",
      headers: {
        "token": localStorage.getItem("@token"),
      },
    });
    const data = await response.json();
    if (!data.success) {
      if (data.message === "Token Expired") {
        if (await refreshToken()) return await deleteLink(_id);
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

export const shrinkLink = async original_url => {
  await sleep(5000);
  if (
    original_url.includes(".") &&
    !original_url.includes("http://") &&
    !original_url.includes("https://")
  ) {
    original_url = "http://" + original_url;
  }
  try {
    const response = await fetch(`${API}/urls`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "token": localStorage.getItem("@token"),
      },
      body: JSON.stringify({ original_url }),
    });
    const data = await response.json();
    if (!data.success) {
      if (data.message === "Token Expired") {
        if (await refreshToken()) return await shrinkLink(original_url);
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
