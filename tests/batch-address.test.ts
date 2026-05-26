import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
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
    // get absolute path from BatchAddressGeocoder
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
    // it should generate a blob
    const fileField = formData.get("addressFile") as File;
    expect(fileField).toBeInstanceOf(Blob);
    // it should hold data
    expect(fileField.size).toBeGreaterThan(0);
    // it should be text/plain
    expect(fileField.type).toBe("text/plain");
    // content should be accurate
    const text = await fileField.text();
    expect(text).toBe("this is some data");
  });
});
