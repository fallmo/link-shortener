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
    case "UPDATE_HIDDEN":
      return {
        ...state,
        links: {
          hidden: action.payload,
        },
      };
    default:
      return state;
  }
};
