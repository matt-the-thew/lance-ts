[**lance-ts**](../README.md)

***

[lance-ts](../globals.md) / geocodeOneLineAddress

# Function: geocodeOneLineAddress()

> **geocodeOneLineAddress**(`address`): `Promise`\<[`OneLineAddressMatch`](../interfaces/OneLineAddressMatch.md) \| `undefined`\>

Defined in: [one-line-address.ts:48](https://github.com/matt-the-thew/lance-ts/blob/188b5c772a5a22c9c9688deb370a37810695144e/src/one-line-address.ts#L48)

Returns the first result from whatever address matches it receives
```
async function geocode() {
 const result = await geocodeOneLineAddress("123 Foo Street, CA, 4242")
 console.log(result)
 // { coordinates: { x: NUMBER, y: NUMBER }, matchedAddress: "ADDR"}
}
```

## Parameters

### address

`string`

{string}

## Returns

`Promise`\<[`OneLineAddressMatch`](../interfaces/OneLineAddressMatch.md) \| `undefined`\>

## Throws

Error - "HTTP Error" if response status is not 200 OK
