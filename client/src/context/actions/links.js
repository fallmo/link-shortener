import { API } from "./constants";

const dummyList = [
  {
    "_id": "5faac680188f7a9640e88720",
    "original_url": "https://yahoo.com/",
    "ref_id": "WMllbV0",
    "user_id": "5faa9a0aa529a092b6d619ac",
    "date": "2020-11-10",
  },
  {
    "_id": "5fad79ef9a64d7b8d38f518e",
    "original_url": "http://haayday.fr",
    "ref_id": "KXzNfuz",
    "date": "2020-11-12",
  },
  {
    "_id": "5fad7a229a64d7b8d38f518f",
    "original_url": "http://testess.fr",
    "ref_id": "7yPM1AA",
    "date": "2020-11-12",
  },
];

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
