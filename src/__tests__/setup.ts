describe("setup", () => {
  it("faut setup mais sa met un fail si y'a pas un test dedans...", () => {
    expect(true).toBe(true);
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

export {};
