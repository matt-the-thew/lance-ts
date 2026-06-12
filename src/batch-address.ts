import * as fs from "node:fs";
import * as path from "path";

/**
 * Batch Address geocoding service.
 *
 * Accepts a .csv file of addresses, formatted in the following manner:
 * ```
 * UNIQUE ID, STREET ADDR., CITY, STATE, ZIP
 * ```
 * Example:
 * ```
 * TACO HEAVEN, 1234 SUNSET BLVD., CA, 12345
 * ```
 * The output file has a slightly different format:
 * ```
 * UNIQUE ID , ORIGINAL ADDRESS , MATCH STATUS , MATCH TYPE , COORDINATES , TIGER/Line ID , SIDE OF STREET
 * ```
 * **Unique Id**: The original id passed in the {@link inputFilePath} file
 *
 * **Original Address**: The complete address passed in the {@link inputFilePath} file
 *
 * **Match status**: Exact (perfect match) | Tie (multiple potential locations) | Non-Exact (uncertain)
 *
 * **Coordinates**: Longitude, Latitude
 *
 * **TIGER/Line ID**: UID of the street segment or geographic block where the address is located
 *
 * **Side of Street**: L (left) | R (right)
 *
 * Initialization example:
 * ```
 * const geocoder = new BatchAddressGeocoder(".../bar/addressFile.csv", ".../foo/outputFile.csv")
 * ```
 */
export class BatchAddressGeocoder {
  // U.S. Census Geocoder endpoint.
  url = "https://geocoding.geo.census.gov/geocoder/locations/addressbatch";
  inputFilePath: string;
  outputFilePath: string;

  /**
   * Sets input and output file paths.
   * @param inputFilePath - The absolute path to the input file.
   * @param outputFilePath - The absolute path to the output file.
   * @throws Error - "Cannot resolve file paths" if missing {@link inputFilePath} or {@link outputFilePath}
   */
  constructor(inputFilePath: string, outputFilePath?: string) {
    if (!inputFilePath || !outputFilePath)
      throw new Error("[BatchAddressGeocoder]: Cannot resolve file paths");

    this.inputFilePath = inputFilePath;
    this.outputFilePath = outputFilePath;
  }

  /**
   * Determines if it is passed a Finds absolute path for a new local file.
   * Otherwise, path for existing file.
   * @param {string} filePath
   * @returns {string | undefined} the relative file path if it i
   */
  _parseFilePath(filePath: string): string | undefined {
    // create absolute directory name for fs methods
    let parsedFilePath: string;
    try {
      parsedFilePath = path.join(import.meta.dirname, filePath);
    } catch (error) {
      throw new Error(`Error parsing file path: ${error}`);
    }

    return parsedFilePath ? parsedFilePath : undefined;
  }

  /**
   * Generates FormData from a file, according to census geocoder specs
   * @param {string} filePath
   * @returns {FormData} Formatted form data, converting the file into a {Blob}
   */
  _createFormData(filePath: string): FormData | undefined {
    const fileBuffer = fs.readFileSync(filePath);
    if (!fileBuffer) throw new Error(`Unable to read file ${filePath}`);

    const blob = new Blob([fileBuffer], { type: "text/plain" });
    const formData = new FormData();

    formData.append("addressFile", blob, path.basename(filePath));
    formData.append("benchmark", "Public_AR_Current");
    formData.append("returntype", "location");

    return formData;
  }

  /**
   * Sends generated FormData from blob-ified {@link inputFilePath} to Census Geocoder endpoint,
   * and writes response to a local file based on {@link outputFilePath}.
   * @returns {void}
   */
  async geocodeBatch(): Promise<void> {
    const formData: FormData | undefined = this._createFormData(
      this.inputFilePath,
    );
    if (!formData)
      throw new Error(
        `Error creating FormData from ${this.inputFilePath}`,
      );
    const response = await fetch(this.url, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    const responseText = await response.text();

    fs.writeFileSync(this.outputFilePath, responseText);
    console.log(`Saved to ${this.outputFilePath}`);
  }
}
