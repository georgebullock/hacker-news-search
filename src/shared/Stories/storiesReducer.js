export const storiesReducer = (state, action) => {
  switch (action.type) {
    case "STORIES_INIT_STORIES":
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case "STORIES_FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case "STORIES_FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case "STORIES_REMOVE_STORY":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: state.data.filter((story) => {
          return action.payload !== story.objectID;
        }),
      };
    default:
      throw new Error("Error: Stories action not found");
  }
};
