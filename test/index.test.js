import stateToUri, { getValuesFromUri, setValuesToUri, setUriSearchString } from '../src';

let oldSearch;

const mockSearch = search => {
  oldSearch = window.location.search;

  setUriSearchString(search);
};

const unmockSearch = () => {
  setUriSearchString(oldSearch);
};

afterEach(() => {
  unmockSearch();
});

describe("getValuesFromUri", () => {
  it("should return values present in the uri", () => {
    mockSearch("foo=bar&blerg=hloom");

    const values = getValuesFromUri(['foo', 'blerg'], {
      foo: 'kazoo',
      blerg: 'grunk',
    });

    expect(values).toEqual({
      foo: 'bar',
      blerg: 'hloom',
    });
  });

  it("should return defaults when values are not present in the uri", () => {
    mockSearch("klutz=mabble&pom=qux");

    const values = getValuesFromUri(['durg', 'ghfex'], {
      durg: 'jak',
      ghfex: 'throbbe',
    });

    expect(values).toEqual({
      durg: 'jak',
      ghfex: 'throbbe',
    });
  });
});

describe("setValuesToUri", () => {
  it("should set non-default values to uri", () => {
    setValuesToUri(['antz', 'plugh', 'krackle'], {
      antz: 'mumg',
      plugh: 'niom',
      krackle: 'efik',
    });

    expect(window.location.search).toBe("?antz=mumg&plugh=niom&krackle=efik");
  });

  it("should unset default values from uri", () => {
    mockSearch("zumg=borg&donk=wuut");

    setValuesToUri(['donk', 'jang', 'blutz'], {
      donk: 'dink',
      jang: 'prung',
      blutz: 'qyes',
      kloogh: 'erop',
    }, {
      donk: 'dink',
      jang: 'karoo',
      blutz: 'yuam',
    });

    expect(window.location.search).toEqual("?zumg=borg&jang=prung&blutz=qyes");
  });
});

describe("stateToUri", () => {
  const initialState = {
    groo: "durk",
    froo: "gurk",
  };

  let get, set;

  beforeEach(() => {
    [get, set] = stateToUri(initialState);
  });

  afterEach(() => {
    get = set = null;
  });

  it("should return two functions", () => {
    expect(typeof get).toBe('function');
    expect(typeof set).toBe('function');
  });

  it("should return default values from getter", () => {
    mockSearch("");

    expect(get()).toEqual(initialState);
  });

  it("should read search params in getter", () => {
    mockSearch("groo=fuffle&froo=mropt");

    expect(get()).toEqual({
      groo: "fuffle",
      froo: "mropt",
    });
  });

  it("should write search params in setter", () => {
    mockSearch("groo=zond&froo=uyup");

    set({
      state: {
        groo: "pockle",
        froo: "burk",
      }
    });

    expect(window.location.search).toBe("?groo=pockle&froo=burk");
  });

  it("should reset search params in setter", () => {
    mockSearch("groo=tronk&froo=engum");

    set({ state: initialState });

    expect(window.location.search).toBe("");
  });
});