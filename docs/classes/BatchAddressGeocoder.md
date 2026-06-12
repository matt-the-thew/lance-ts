[**lance-ts**](../README.md)

***

[lance-ts](../globals.md) / BatchAddressGeocoder

# Class: BatchAddressGeocoder

Defined in: [batch-address.ts:36](https://github.com/matt-the-thew/lance-ts/blob/188b5c772a5a22c9c9688deb370a37810695144e/src/batch-address.ts#L36)

Batch Address geocoding service.

Accepts a .csv file of addresses, formatted in the following manner:
```
UNIQUE ID, STREET ADDR., CITY, STATE, ZIP
```
Example:
```
TACO HEAVEN, 1234 SUNSET BLVD., CA, 12345
```
The output file has a slightly different format:
```
UNIQUE ID , ORIGINAL ADDRESS , MATCH STATUS , MATCH TYPE , COORDINATES , TIGER/Line ID , SIDE OF STREET
```
**Unique Id**: The original id passed in the [inputFilePath](#inputfilepath) file

**Original Address**: The complete address passed in the [inputFilePath](#inputfilepath) file

**Match status**: Exact (perfect match) | Tie (multiple potential locations) | Non-Exact (uncertain)

**Coordinates**: Longitude, Latitude

**TIGER/Line ID**: UID of the street segment or geographic block where the address is located

**Side of Street**: L (left) | R (right)

Initialization example:
```
const geocoder = new BatchAddressGeocoder(".../bar/addressFile.csv", ".../foo/outputFile.csv")
```

## Constructors

### Constructor

> **new BatchAddressGeocoder**(`inputFilePath`, `outputFilePath?`): `BatchAddressGeocoder`

Defined in: [batch-address.ts:48](https://github.com/matt-the-thew/lance-ts/blob/188b5c772a5a22c9c9688deb370a37810695144e/src/batch-address.ts#L48)

Sets input and output file paths.

#### Parameters

##### inputFilePath

`string`

The absolute path to the input file.

##### outputFilePath?

`string`

The absolute path to the output file.

#### Returns

`BatchAddressGeocoder`

#### Throws

Error - "Cannot resolve file paths" if missing [inputFilePath](#constructorbatchaddressgeocoder) or [outputFilePath](#constructorbatchaddressgeocoder)

## Properties

### inputFilePath

> **inputFilePath**: `string`

Defined in: [batch-address.ts:39](https://github.com/matt-the-thew/lance-ts/blob/188b5c772a5a22c9c9688deb370a37810695144e/src/batch-address.ts#L39)

***

### outputFilePath

> **outputFilePath**: `string`

Defined in: [batch-address.ts:40](https://github.com/matt-the-thew/lance-ts/blob/188b5c772a5a22c9c9688deb370a37810695144e/src/batch-address.ts#L40)

***

### url

> **url**: `string` = `"https://geocoding.geo.census.gov/geocoder/locations/addressbatch"`

Defined in: [batch-address.ts:38](https://github.com/matt-the-thew/lance-ts/blob/188b5c772a5a22c9c9688deb370a37810695144e/src/batch-address.ts#L38)

## Methods

### \_createFormData()

> **\_createFormData**(`filePath`): `FormData` \| `undefined`

Defined in: [batch-address.ts:79](https://github.com/matt-the-thew/lance-ts/blob/188b5c772a5a22c9c9688deb370a37810695144e/src/batch-address.ts#L79)

Generates FormData from a file, according to census geocoder specs

#### Parameters

##### filePath

`string`

#### Returns

`FormData` \| `undefined`

Formatted form data, converting the file into a {Blob}

***

### \_parseFilePath()

> **\_parseFilePath**(`filePath`): `string` \| `undefined`

Defined in: [batch-address.ts:62](https://github.com/matt-the-thew/lance-ts/blob/188b5c772a5a22c9c9688deb370a37810695144e/src/batch-address.ts#L62)

Determines if it is passed a Finds absolute path for a new local file.
Otherwise, path for existing file.

#### Parameters

##### filePath

`string`

#### Returns

`string` \| `undefined`

the relative file path if it i

***

### geocodeBatch()

> **geocodeBatch**(): `Promise`\<`void`\>

Defined in: [batch-address.ts:98](https://github.com/matt-the-thew/lance-ts/blob/188b5c772a5a22c9c9688deb370a37810695144e/src/batch-address.ts#L98)

Sends generated FormData from blob-ified [inputFilePath](#inputfilepath) to Census Geocoder endpoint,
and writes response to a local file based on [outputFilePath](#outputfilepath).

#### Returns

`Promise`\<`void`\>
