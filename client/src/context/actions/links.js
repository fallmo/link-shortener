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
    if (!data.success) return { error: data.message };
    return { data: data.data };
  } catch (err) {
    return { error: "Failed to make request" };
  }
};

export const shrinkLink = async original_url => {
  await sleep(5000);
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
    if (!data.success) return { error: data.message };
    return { data: data.data };
  } catch (err) {
    return { error: "Failed to make request" };
  }
};

const sleep = async ms => {
  return await new Promise(resolve => setTimeout(() => resolve(), ms));
};
