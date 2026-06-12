[**lance-ts**](../README.md)

***

[lance-ts](../globals.md) / geocodeOneLineAddressAll

# Function: geocodeOneLineAddressAll()

> **geocodeOneLineAddressAll**(`address`): `Promise`\<[`OneLineAddressMatch`](../interfaces/OneLineAddressMatch.md)[] \| `undefined`\>

Defined in: [one-line-address.ts:97](https://github.com/matt-the-thew/lance-ts/blob/188b5c772a5a22c9c9688deb370a37810695144e/src/one-line-address.ts#L97)

Returns array of [OneLineAddressMatch](../interfaces/OneLineAddressMatch.md), if one or more results exist.

## Parameters

### address

`string`

The address to submit to the census geocoder

## Returns

`Promise`\<[`OneLineAddressMatch`](../interfaces/OneLineAddressMatch.md)[] \| `undefined`\>

| undefined

## Throws

Error - "HTTP Error" if response status is not OK.
