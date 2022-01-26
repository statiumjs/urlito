const identity = o => o;

export const setUriSearchString = search => {
  window.history.replaceState({}, '', `${window.location.pathname}?${search}`);
};

const normalizeKeys = keys => {
  if (Array.isArray(keys)) {
    return keys.map(key => ({
      key,
      uriKey: key,
      fromUri: identity,
      toUri: identity,
      equals: Object.is,
    }));
  }
  else {
    return Object.keys(keys).map(key => {
      const options = keys[key];

      return {
        key,
        uriKey: options.uriKey || key,
        fromUri: options.fromUri || identity,
        toUri: options.toUri || identity,
        equals: options.comparator || Object.is,
      };
    });
  }
};

export const getValuesFromUri = (stateKeys, defaults = {}) => {
  const values = { ...defaults };

  try {
    const params = new URLSearchParams(window.location.search);
    const keys = normalizeKeys(stateKeys);

    for (const { key, uriKey, fromUri, equals } of keys) {
      if (params.has(uriKey)) {
        const value = fromUri(params.get(uriKey));

        if (!equals(value, defaults[key])) {
          values[key] = value;
        }
      }
    }
  }
  catch (e) {
    // This block is intentionally left blank to defang ESLint no-empty rule.
  }

  return values;
};

export const setValuesToUri = (stateKeys, values = {}, defaults = {}) => {
  const params = new URLSearchParams(window.location.search);
  const keys = normalizeKeys(stateKeys);

  for (const { key, uriKey, toUri, equals } of keys) {
    const value = values[key];
    const defaultValue = defaults[key];

    if (equals(value, defaultValue)) {
      params.delete(uriKey);
    }
    else {
      params.set(uriKey, toUri(value));
    }
  }

  setUriSearchString(params);
};

const stateToUri = (initialState, stateKeys) => {
  stateKeys = stateKeys || Object.keys(initialState);

  return [
    () => getValuesFromUri(stateKeys, initialState),
    ({ state }) => setValuesToUri(stateKeys, state, initialState)
  ];
};

export default stateToUri;
