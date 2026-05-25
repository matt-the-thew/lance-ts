export interface CensusCoordinates {
  x: number;
  y: number;
}

export interface OneLineAddressMatch {
  coordinates: CensusCoordinates;
  matchedAddress: string;
}

export interface OneLineAddressResult {
  addressMatches: OneLineAddressMatch[];
}

export interface OneLineAddressResponse {
  result?: OneLineAddressResult;
}

/**
 * Returns the first result from whatever address matches it receives
 * @param address {string}
 * @returns {OneLineAddressMatch}
 */
export async function geocodeOneLineAddress(
  address: string,
): Promise<OneLineAddressMatch | undefined> {
  const params = new URLSearchParams({
    address,
    benchmark: "Public_AR_Current",
    format: "json",
  });

  const url = `https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?${params}`;
  const response: Response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

  // Retreives array of coordinates and string of matched addresses from API res
  const data = (await response.json()) as OneLineAddressResponse;
  const matches = data.result?.addressMatches;

  if (!matches?.length) {
    console.log(`No matches found for: ${address}`);
    return;
  }

  if (matches?.length > 1) {
    console.warn(`Multiple address matches found for ${address}`);
    for (const match of matches) {
      console.warn("Matched address:", match.matchedAddress);
      console.warn("Consider geocodeOneLineAddressAll()");
      console.warn(
        `Coordinates:
      X: ${match.coordinates["x"]}
      ${match.coordinates["y"]}`,
      );
    }
  }

  return matches[0];
}

export async function geocodeOneLineAddressAll(
  address: string,
): Promise<OneLineAddressMatch[] | undefined> {
  const params = new URLSearchParams({
    address,
    benchmark: "Public_AR_Current",
    format: "json",
  });

  const url = `https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?${params}`;
  const response: Response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

  // Retreives array of coordinates and string of matched addresses from API res
  const data = (await response.json()) as OneLineAddressResponse;
  const matches = data.result?.addressMatches;

  if (!matches?.length) {
    console.log(`No matches found for: ${address}`);
    return;
  }

  return matches;
}
