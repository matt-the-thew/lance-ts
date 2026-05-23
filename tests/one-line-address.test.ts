import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { geocodeOneLineAddress } from "../src/one-line-address";
import { json } from "stream/consumers";

describe("geocodeOneLineAddress", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetAllMocks();
  });

  it("returns lat/lng coordinates when Census Geocoder finds a match", async () => {
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

    expect(result?.coordinates).toEqual({
      x: -77.0365,
      y: 38.8977,
    });

    expect(result?.matchedAddress).toEqual(
      "1600 Pennsylvania Ave NW, Washington, DC",
    );

    expect(fetchMock).toHaveBeenCalledOnce();
  });
});
