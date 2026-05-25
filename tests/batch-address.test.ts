import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  test,
  assert,
} from "vitest";
import { BatchAddressGeocoder } from "../src/batch-address";
import { fs, vol } from "memfs";
import * as path from "path";

describe("BatchAddressGeocoder", () => {
  // mock function to replace fetch
  const fetchMock = vi.fn();
  // create geocoder instance
  const TestGeocoder = new BatchAddressGeocoder("testpath.csv");
  // set up fs mocks for memfs
  vi.mock("node:fs");
  vi.mock("node:fs/promises");

  beforeEach(() => {
    // make fetch mock func globally available
    vi.stubGlobal("fetch", fetchMock);
    // reset the state of in-memory fs
    vol.reset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetAllMocks();
  });

  it("initializes with the correct endpoint", () => {
    expect(TestGeocoder.url).toEqual(
      "https://geocoding.geo.census.gov/geocoder/locations/addressbatch",
    );
  });

  it("correctly parses absolute file path", () => {
    // get absolute path
    const parsedPath = TestGeocoder._parseFilePath(TestGeocoder.inputFilePath);
    // it should exist
    expect(parsedPath);
    if (parsedPath) {
      // it should be absolute
      expect(path.isAbsolute(parsedPath));
    }
  });

  it("generates accurate form data", async () => {
    //initialize and write to mock file
    const mockFile = "/mockfile.csv";
    fs.writeFileSync(mockFile, "this is some data");
    // generate form data
    const formData = TestGeocoder._createFormData(mockFile) as FormData;

    // the file field should exist
    expect(formData.get("addressFile")).toBeTruthy;
    const fileField = formData.get("addressFile") as File;
    // it should generate a blob
    expect(fileField).toBeInstanceOf(Blob);
    // it should hold data
    expect(fileField.size).toBeGreaterThan(0);
    // it should be text/plain
    expect(fileField.type).toBe("text/plain");
    // content should be accurate
    const text = await fileField.text();
    expect(text).toBe("this is some data");
  });

  it("Creates a csv file", () => {
    return true;
  });

  // it("returns list of matched addresses if multiple addresses match the input", async () => {
  //   fetchMock.mockResolvedValue({
  //     ok: true,
  //     json: async () => ({
  //       result: {
  //         addressMatches: [
  //           {
  //             coordinates: { x: -77.0365, y: 38.8977 },
  //             matchedAddress: "1600 Pennsylvania Ave NW, Washington, DC",
  //           },
  //           {
  //             coordinates: { x: -77.0555, y: 38.8555 },
  //             matchedAddress: "1601 Pennsylvania Ave NW, Washington, DC",
  //           },
  //         ],
  //       },
  //     }),
  //   } as Response);

  //   const result = await geocodeBatch(
  //     "1600 Pennsylvania Ave NW, Washington, DC",
  //   );

  //   expect(result?.addressMatches)
  // })
  // )
});
