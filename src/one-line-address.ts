/**
 * Interface for lat/lng coordinates
 * @interface CensusCoordinates
 */
export interface CensusCoordinates {
  x: number;
  y: number;
}

/**
 * Interface for a single coordinate pair as {@link CensusCoordinates}
 * and the associated matched address, as {@type string}
 * @interface OneLineAddressMatch
 */
export interface OneLineAddressMatch {
  coordinates: CensusCoordinates;
  matchedAddress: string;
}

/**
 * Interface representing an array of {@link OneLineAddressMatch}
 * @interface OneLineAddressResult
 */
export interface OneLineAddressResult {
  addressMatches: OneLineAddressMatch[];
}

/**
 * Interface for the optional result, of type {@link OneLineAddressResult}
 */
export interface OneLineAddressResponse {
  result?: OneLineAddressResult;
}

/**
 * Returns the first result from whatever address matches it receives
 * ```
 * async function geocode() {
 *  const result = await geocodeOneLineAddress("123 Foo Street, CA, 4242")
 *  console.log(result)
 *  // { coordinates: { x: NUMBER, y: NUMBER }, matchedAddress: "ADDR"}
 * }
 * ```
 * @param address {string}
 * @returns {OneLineAddressMatch}
 * @throws Error - "HTTP Error" if response status is not 200 OK
 */
export async function geocodeOneLineAddress(
  address: string,
): Promise<OneLineAddressMatch | undefined> {
  //format parameters to use latest census data
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

  // warns if multiple matched addresses exist for a single address
  if (matches?.length > 1) {
    console.warn(`Multiple address matches found for ${address}`);
    for (const match of matches) {
      console.warn(`[WARNING}: multimple matched addresses for: ${match.matchedAddress}
      Coordinates:
      X: ${match.coordinates["x"]}
      Y: ${match.coordinates["y"]}
      Consider geocodeOneLineAddressAll()`);
    }
  }

  if (matches[0]) {
    return {
      coordinates: matches[0].coordinates,
      matchedAddress: matches[0].matchedAddress,
    };
  }
}

/**
 * Returns array of {@link OneLineAddressMatch}, if one or more results exist.
 * @param {string} address - The address to submit to the census geocoder
 * @returns {OneLineAddressMatch[]} | undefined
 * @throws Error - "HTTP Error" if response status is not OK.
 */
export async function geocodeOneLineAddressAll(
  address: string,
): Promise<OneLineAddressMatch[] | undefined> {
  //format parameters to use latest census data
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
