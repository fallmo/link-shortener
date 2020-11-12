export default (state, action) => {
  switch (action.type) {
    case "USER_IN":
      return {
        ...state,
        auth: {
          isLoading: false,
          user: action.payload,
        },
      };
    case "USER_OUT":
      return {
        ...state,
        auth: {
          isLoading: false,
          user: null,
        },
      };
    default:
      return state;
  }
};
