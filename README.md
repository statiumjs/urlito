# Urlito

Declarative API for persisting application state to URL.

## Installation

`npm i urlito` or `yarn add urlito`

## Introduction

A helper library for [Statium](https://github.com/statiumjs/statium), Urlito makes it easier
to persist application state to the `search` parameters portion of its URL.

The default export is a function (`stateToUri`) that accepts two arguments. The first
argument is an object with keys and values corresponding to the default state of the
Store. The second argument is state key descriptors enumerating keys that should be
retrieved from the URL by getter function, and persisted to the URL by the setter function. If the second argument is not present, all keys defined in the first argument will be checked against URL search parameters and values are treated as strings.

The return value is a tuple of these functions: `[getStateFromUri, setStateToUri]`.

```javascript
import Store from 'statium';
import stateToUri from 'urlito';

// Default state values. In this example, we define a set of values,
// not all of which are persisted to the URI.
const defaultState = {
  foo: 'frob',
  bar: "fred",
  baz: 42,
  qux: Date.now(),
};

// The second argument is defining which values will be persisted,
// how to parse them from URI and how to convert them to stringified form
// when persisting back to URI.
const [getStateFromUri, setStateToUri] = stateToUri(defaultState, [
  'foo',
  {
    // State key, as in defaultState
    key: 'qux',
    // URI key might be different (optional)
    uriKey: 'time',
    // Optional converter from URL format
    fromUri: time => new Date(parseInt(time, 10)),
    // Optional converter to URL format
    toUri: time => time.toString(),
    // Optional comparator
    equals: (a, b) => a.getTime() === b.getTime(),
  },
});

const Component = () => (
  <Store initialState={getStateFromUri} onStateChange={setStateToUri}>
    {/* ... */}
  </Store>
);
```

## Retrieving state

To read state from URI, the `getStateFromUri` function should be called with no arguments.
It will iterate over the state keys defined in `stateToUri` call, and if the key is present
in the URL search parameters, its value will be used instead of default. If the key is not present, the corresponding value from `defaultState` will be returned instead.

The return value is an object with key/value pairs that can be passed to `initialState` prop of a Statium Store.

## Persisting state

To write state to the URI, the `setStateToUri` function should be called with one argument:
a Statium Store API object, containint specifically the `state` property. For each state key defined in the `stateToUri` call, the actual value will be compared with default value; if the value in the actual state object is defined and does not equal to default, it will be persisted to the search parameters of the URL. If the value in the actual state object equals to default, this key will be deleted from the URL search parameters.

There is no return value for this function.

## State key descriptors

The second argument to `stateToUri` function is a data structure that describes state keys
to be persisted. This can be an object describing keys and their properties, or an array of descriptors.

An array is the simplified form:

```javascript
const stateKeys = [
  // Read parameter 'foo' in the URL search parameters, treat the value as a string,
  // set the value to key 'foo' in the state object
  'foo',
  
  { ... }, // See object form below
];
```

An object has the following format:

```javascript
const stateKeys = {
  foo: {
    // Define key selector in array format, ignored for object format
    key: 'foo',
    
    // Name of the URL search parameter to read from/write to
    uriKey: 'foobaroo',
    
    // Function that parses the value when reading from the URL.
    // Default is to return the value as is, which produces a string.
    fromUri: value => value,
    
    // Function that stringifies the value when writing to the URL.
    // Default is no special conversion, which will stringify the value
    // when assigning URL search parameters.
    toUri: value => value,
    
    // Function to compare default value with actual value when reading from
    // URL (after parsing) and writing to URL (before stringification).
    // This function is passed two arguments and is expected to return true
    // when they are equal, false otherwise.
    // Default is Object.is()
    equals: (a, b) => Object.is(a, b),
  },
};
```
