# Lance-TS

**Opinionated TypeScript client for the U.S. Census Geocoder API.**

Turn U.S. addresses into latitude/longitude coordinates using the free [Census Bureau Geocoder](https://geocoding.geo.census.gov/geocoder/). Strongly-typed, totally node-native.

---

## Use Case:

If you're working with U.S. address data, the Census Geocoder is an extremely viable, completely free API. Backed by the official MAF/TIGER address database, and covering virtually every U.S. address, it has no posted rate limits and no API key. 

### The Issue:

The raw Census Geocoder API response is verbose and awkward to work with.
Below is the simplest possible response; a single one-line address match:
```json
{"result": {
     "input": {
          "address": {"address": "4600 Silver Hill Rd, Washington, DC 20233"},
          "benchmark": {
               "isDefault": true,
               "benchmarkDescription": "Public Address Ranges - Current Benchmark",
               "id": "4",
               "benchmarkName": "Public_AR_Current"
          }
     },
     "addressMatches": [{
          "tigerLine": {
               "side": "L",
               "tigerLineId": "76355984"
          },
          "coordinates": {
               "x": -76.92748724230096,
               "y": 38.84601622386617
          },
          "addressComponents": {
               "zip": "20233",
               "streetName": "SILVER HILL",
               "preType": "",
               "city": "WASHINGTON",
               "preDirection": "",
               "suffixDirection": "",
               "fromAddress": "4600",
               "state": "DC",
               "suffixType": "RD",
               "toAddress": "4700",
               "suffixQualifier": "",
               "preQualifier": ""
          },
          "matchedAddress": "4600 SILVER HILL RD, WASHINGTON, DC, 20233"
     }]
}}
```
For applications that require lightweight & simple coordinate responses, `lance-ts` provides a clean, strongly-typed interface so you can go from address → coordinates in one call.

- 🆓 **Free** — no API key, no account, no rate limits
- 🏛️ **Official Data** — calls the U.S. Census Bureau Geocoder
- 📦 **Lightweight** — no HTTP library dependencies; uses node-native `fetch`

---

## Installation

```bash
# pnpm (recommended)
pnpm add lance-ts

# npm
npm install lance-ts

# yarn
yarn add lance-ts
```

Requires **Node.js 18+** (for native `fetch`).

---

## Quick Start

```ts
import { geocodeOneLineAddress } from "lance-ts";

const result = await geocodeOneLineAddress(
  "1600 Pennsylvania Avenue NW, Washington, DC 20500"
);

if (result) {
  console.log(result.coordinates.x);  // 38.8987...
  console.log(result.coordinates.y);  // -77.0353...
  console.log(result.matchedAddress);  // "1600 Pennsylvania..."
}
```

---

## How It Works

`lance-ts` sends your address to the Census Bureau's public REST endpoint:

```
https://geocoding.geo.census.gov/geocoder/locations/onelineaddress
```

The response is parsed and normalized, extracting the matched coordinates and canonical address from the Census Bureau's nested JSON structure, and returned as a clean, typed object.

---

## Getting Started 

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Run tests with UI
pnpm test --ui
```

### Project Structure

```bash
lance-ts/
|--src/   # TypeScript source
|--dist/  # Compiled output (generated)
|--tsconfig.json
|--package.json
```
---

## Limitations

- U.S. addresses only
- Coordinate results are **interpolated** from TIGER address ranges. Very small error margin, but not always rooftop-precise.
- Reverse geocoding (coordinates -> address) is not yet implemented. *Coming soon!*

---

## Resources

- [Census Geocoder Web Interface](https://geocoding.geo.census.gov/geocoder/)
- [Census Geocoder API Docs](https://www.census.gov/programs-surveys/geography/technical-documentation/complete-technical-documentation/census-geocoder.html)
- [MAF/TIGER Database Overview](https://www.census.gov/geographies/mapping-files/time-series/geo/tiger-line-file.html)

---

## License

ISC © [matt-the-thew](https://github.com/matt-the-thew)
