import React, { createContext, useReducer } from "react";
import { checkAuth } from "./actions/auth";
import reducer from "./reducer";
const initialState = {
  auth: {
    isLoading: true,
    user: null,
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
      if (error) localStorage.removeItem("@token");
      return dispatch({ type: "USER_OUT" });
    }
  };
  return (
    <Context.Provider value={{ ...state, initAuth }}>
      {children}
    </Context.Provider>
  );
};
