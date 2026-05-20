interface OneLineAddressMatches {
  tigerLine: {
    side: string;
    tigerLineId: string;
  };
  coordinates: {
    x: number;
    y: number;
  };
  addressComponents: {
    zip: string;
    streetName: string;
    preType: string;
    city: string;
    preDirection: string;
    suffixDirection: string;
    state: string;
    suffixType: string;
    toAddress: string;
    suffixQualifier: string;
    preQualifier: string;
  };
  matchedAddress: string;
}
export default async function geocodeOneLineAddress(
  address: string,
): Promise<OneLineAddressMatches | undefined> {
  const params = new URLSearchParams({
    address,
    benchmark: "Public_AR_Current",
    format: "json",
  });

  const url = `https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?${params}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

  const data = await response.json();
  const matches = data.result?.addressMatches;

  if (!matches?.length) {
    console.log(`No matches found for: ${address}`);
    return;
  }

  for (const match of matches) {
    console.log("Matched address:", match.matchedAddress);
    console.log(
      `Coordinates:
      X: ${match.coordinates["x"]}
      ${match.coordinates["y"]}`,
    );
  }

  return matches;
}

console.log(
  await geocodeOneLineAddress("5838 cape horn drive, agoura hills, ca, 91301"),
);
