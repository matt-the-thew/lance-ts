import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  geocodeOneLineAddress,
  geocodeOneLineAddressAll,
} from "../src/one-line-address";
import { json } from "stream/consumers";
import { isAsyncFunction } from "util/types";

// create mocking function
const fetchMock = vi.fn();

beforeEach(() => {
  // substitute mocking function for node "fetch"
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  // reset everything after testing
  vi.unstubAllGlobals();
  vi.resetAllMocks();
});

describe("geocodeOneLineAddress", () => {
  it("returns lat/lng coordinates when response includes a match", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        result: {
          addressMatches: [
            {
              coordinates: { x: -77.0365, y: 38.8977 },
              matchedAddress: "1600 Pennsylvania Ave NW, Washington, DC",
            },
          ],
        },
      }),
    } as Response);

    const result = await geocodeOneLineAddress(
      "1600 Pennsylvania Ave NW, Washington, DC",
    );

    //it should exist
    expect(result).toBeTruthy();
    //it should have correct data
    expect(result?.coordinates).toEqual({
      x: -77.0365,
      y: 38.8977,
    });

    expect(result?.matchedAddress).toEqual(
      "1600 Pennsylvania Ave NW, Washington, DC",
    );
    //it should call fetch once per response
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it("warns when multiple address matches exist", async () => {
    //spy on warn output stream
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    //set up mocked fetch result with multiple entires
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        result: {
          addressMatches: [
            {
              coordinates: { x: -77.0365, y: 38.8977 },
              matchedAddress: "1600 Pennsylvania Ave NW, Washington, DC",
            },
            {
              coordinates: { x: -78.0, y: 40.0 },
              matchedAddress: "1602 Pennsylvania Ave NW, Washington, DC",
            },
          ],
        },
      }),
    } as Response);

    const result = await geocodeOneLineAddress(
      "1600 Pennsylvania Ave NW, Washington, DC",
    );

    //it should exist
    expect(result).toBeTruthy;
    //it should raise a warning
    expect(warnSpy).toHaveBeenCalled();
    //it should raise the correct warning
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining("Consider geocodeOneLineAddressAll()"),
    );
  });
});

describe("geocodeOneLineAddressAll", () => {
  it("returns array of all matched addresses", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        result: {
          addressMatches: [
            {
              coordinates: { x: -77.0365, y: 38.8977 },
              matchedAddress: "1600 Pennsylvania Ave NW, Washington, DC",
            },
            {
              coordinates: { x: -78.0, y: 40.0 },
              matchedAddress: "1602 Pennsylvania Ave NW, Washington, DC",
            },
          ],
        },
      }),
    } as Response);

    const result = await geocodeOneLineAddressAll(
      "1600 Pennsylvania Ave NW, Washington, DC",
    );

    //it should exist
    expect(result).toBeTruthy;
    //it should be the correct size
    expect(result?.length).toBe(2);
    //it should have correct data
    expect(result[0]?.coordinates).toEqual({
      x: -77.0365,
      y: 38.8977,
    });
    expect(result[0]?.matchedAddress).toEqual(
      "1600 Pennsylvania Ave NW, Washington, DC",
    );
    expect(result[1]?.coordinates).toEqual({
      x: -78.0,
      y: 40.0,
    });
    expect(result[1]?.matchedAddress).toEqual(
      "1602 Pennsylvania Ave NW, Washington, DC",
    );
    //it should call fetch once per response
    expect(fetchMock).toHaveBeenCalledOnce();
  });
});
