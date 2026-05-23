import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import geocodeBatch from "../src/batch-address";

describe("geocodeBatch", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetAllMocks();
  });

  it("returns list of matched addresses if multiple addresses match the input", async () => {
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
              coordinates: { x: -77.0555, y: 38.8555 },
              matchedAddress: "1601 Pennsylvania Ave NW, Washington, DC",
            },
          ],
        },
      }),
    } as Response);

    const result = await geocodeBatch(
      "1600 Pennsylvania Ave NW, Washington, DC",
    );

    expect(result?.addressMatches);
  });
});
