import Actions from "./actionTypes";

export const setDaysAction = days => ({
  type: Actions.SET_DAYS,
  payload: {
    days
  }
});

export const setStartDateAction = newDate => ({
  type: Actions.SET_START_DATE,
  payload: {
    newDate
  }
});

export const updateCategoriesAction = categories => ({
  type: Actions.UPDATE_CATEGORIES,
  payload: {
    categories
  }
});

export const setTimeAction = (type, time, newTime) => ({
  type: Actions.SET_SCHEDULE_TIME,
  payload: {
    type,
    time,
    newTime
  }
});

export const setLocationAction = location => ({
  type: Actions.SET_USER_LOCATION,
  payload: {
    location
  }
});

export const setFetchedDataAction = data => ({
  type: Actions.SET_FETCHED_DATA,
  payload: {
    data
  }
});
