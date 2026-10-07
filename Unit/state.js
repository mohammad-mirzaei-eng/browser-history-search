let state = {
  searchResults: [],
  currentPage: 1,
  resultsPerPage: 20,
  lastChecked: null,
  currentLanguage: 'fa',
};

export function getState() {
  return state;
}

export function setState(newState) {
  state = { ...state, ...newState };
}
