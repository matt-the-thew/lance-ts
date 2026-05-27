import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { fs, vol } from "memfs";
import * as path from "path";

vi.mock("node:fs", async () => {
  const { fs } = await import("memfs");
  return fs;
});
//import BatchAddressGeocoder AFTER fs is mocked
//so it initializes pointed at mocked module
import { BatchAddressGeocoder } from "./batch-address.js";

describe("BatchAddressGeocoder", () => {
  let geocoder: BatchAddressGeocoder;
  // set up memfs dir and file
  const mockFilePath = "/out/mockfile.csv";
  // mock function to replace fetch
  const fetchMock = vi.fn();
  // set test class function
  beforeEach(() => {
    // make fetch mock func globally available
    vi.stubGlobal("fetch", fetchMock);
    // reset the state of in-memory fs
    vol.reset();
    //generate entire filetree
    vol.mkdirSync("/out", { recursive: true });
    //initialize geocoder
    geocoder = new BatchAddressGeocoder("");
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetAllMocks();
  });

  it("initializes with the correct endpoint", () => {
    expect(geocoder.url).toEqual(
      "https://geocoding.geo.census.gov/geocoder/locations/addressbatch",
    );
  });

  describe("_parseFilePath", () => {
    it("correctly parses the absolute file path", () => {
      //generate mockFile
      vol.writeFileSync(mockFilePath, "this is some data");
      //point geocoder at mock file
      geocoder.inputFilePath = mockFilePath;
      // get absolute path from BatchAddressGeocoder
      const parsedPath = geocoder._parseFilePath(geocoder.inputFilePath);
      // it should exist
      expect(parsedPath);
      if (parsedPath) {
        // it should be absolute
        expect(path.isAbsolute(parsedPath));
      }
    });
  });

  describe("_createFormData", async () => {
    it("generates accurate form data", async () => {
      //initialize and write to mock file
      const mockFilePath = "/mockfile.csv";
      vol.writeFileSync(mockFilePath, "this is some data");
      //point geocoder at mocked file
      geocoder.inputFilePath = mockFilePath;
      // generate form data
      const formData = geocoder._createFormData(
        geocoder.inputFilePath,
      ) as FormData;
      // the file field should exist
      expect(formData.get("addressFile")).toBeDefined();
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

  describe("geocodeBatch", async () => {
    it("returns correct data in .csv format", async () => {
      const fetchSpy = vi.spyOn(global, "fetch");
      //initialize and write to mock file
      vol.writeFileSync(
        mockFilePath,
        "FIELD 1, FIELD 2, FIELD 3, FIELD 4",
      );
      const geocoder = new BatchAddressGeocoder(
        mockFilePath,
        "/out/output.csv",
      );
      const geocodeBatchSpy = vi.spyOn(geocoder, "geocodeBatch");
      //mock file blob response
      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        text: () => Promise.resolve("FIELD 1, FIELD 2, FIELD 3, FIELD 4"),
      });
      await geocoder.geocodeBatch();
      //geocode function should be called once
      expect(geocodeBatchSpy).toHaveBeenCalledOnce();
      //output file should exist
      expect(fs.existsSync("/out/output.csv")).toBeTruthy;
      //fetch should have been called once
      expect(fetchSpy).toHaveBeenCalledOnce();
      expect(fs.readFileSync("/out/output.csv", "utf-8")).toContain(
        "FIELD 1, FIELD 2, FIELD 3, FIELD 4",
      );
    });
  });
});
