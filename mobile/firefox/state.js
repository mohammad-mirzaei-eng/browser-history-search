let state = {
  searchResults: [],
  lastChecked: null,
  currentLanguage: 'fa',
};

export function getState() {
  return state;
}

export function setState(newState) {
  state = { ...state, ...newState };
}
