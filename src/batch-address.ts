import * as fs from "node:fs";
import * as path from "path";

/**
 * Batch geocoder session handler
 * @param {string} inputFilePath
 * @param {string} outputFilePath - @default
 */
export class BatchAddressGeocoder {
  // Set geocoder endpoint
  url = "https://geocoding.geo.census.gov/geocoder/locations/addressbatch";

  inputFilePath: string;
  outputFilePath: string = "batch_coordinates.csv";

  constructor(inputFilePath: string, outputFilePath?: string) {
    this.inputFilePath = inputFilePath;
    if (outputFilePath) this.outputFilePath = outputFilePath;
  }

  /**
   * Finds relative path for a file name
   * @param {string} localFilePath
   * @returns {string | undefined} the realtive file path, if exists
   * @throws {Error} if unable to find relative path
   */
  _parseFilePath(localFilePath: string): string | undefined {
    // create absolute directory name for fs methods
    let parsedFilePath: string;
    try {
      parsedFilePath = path.join(import.meta.dirname, localFilePath);
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
