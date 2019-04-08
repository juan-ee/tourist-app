import Actions from "./actionTypes";

const initialState = {
  totalDays: "",
  startDate: null,
  location: null,
  travelSchedule: {
    start: "0900",
    end: "1800"
  },
  lunchTime: {
    start: "1300",
    end: "1400"
  },
  categories: []
};

export const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.SET_DAYS: {
      return {
        ...state,
        totalDays: action.payload.days
      };
    }
    case Actions.SET_START_DATE: {
      return {
        ...state,
        startDate: action.payload.newDate
      };
    }

    case Actions.UPDATE_CATEGORIES: {
      return {
        ...state,
        categories: action.payload.categories
      };
    }

    case Actions.SET_SCHEDULE_TIME: {
      const { type, time, newTime } = action.payload;

      return {
        ...state,
        [type]: {
          ...state[type],
          [time]: newTime
        }
      };
    }

    case Actions.SET_USER_LOCATION: {
      return {
        ...state,
        location: action.payload.location
      };
    }

    default:
      return state;
  }
};
