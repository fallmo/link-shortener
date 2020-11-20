import { stat } from "fs";
import React, { createContext, useReducer } from "react";
import { checkAuth } from "./actions/auth";
import reducer from "./reducer";
const initialState = {
  auth: {
    isLoading: true,
    user: null,
  },
  links: {
    hidden: JSON.parse(localStorage.getItem("@hiddenLinks")) || [],
  },
};

export const Context = createContext(initialState);

export const Provider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const initAuth = async () => {
    const { error, user } = await checkAuth();
    if (user) {
      return dispatch({ type: "USER_IN", payload: user });
    } else {
      if (error) {
        localStorage.removeItem("@token");
        localStorage.removeItem("@refreshToken");
      }
      return dispatch({ type: "USER_OUT" });
    }
  };

  const setUser = ({ token, refreshToken, ...rest }) => {
    localStorage.setItem("@token", token);
    localStorage.setItem("@refreshToken", refreshToken);
    return dispatch({ type: "USER_IN", payload: rest });
  };

  const unsetUser = () => {
    localStorage.removeItem("@token");
    localStorage.removeItem("@refreshToken");
    return dispatch({ type: "USER_OUT" });
  };

  const hideLink = _id => {
    const hidden = [...state.links.hidden];
    if (!hidden.includes(_id)) hidden.push(_id);
    localStorage.setItem("@hiddenLinks", JSON.stringify(hidden));
    return dispatch({ type: "UPDATE_HIDDEN", payload: hidden });
  };
  const unHideLink = _id => {
    const hidden = [...state.links.hidden].filter(id => id !== _id);
    localStorage.setItem("@hiddenLinks", JSON.stringify(hidden));
    return dispatch({ type: "UPDATE_HIDDEN", payload: hidden });
  };
  return (
    <Context.Provider
      value={{ ...state, initAuth, setUser, unsetUser, hideLink, unHideLink }}
    >
      {children}
    </Context.Provider>
  );
};
