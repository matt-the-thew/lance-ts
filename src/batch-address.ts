import * as fs from "fs";
import * as path from "path";

export class BatchAddressGeocoder {
  url = "https://geocoding.geo.census.gov/geocoder/locations/addressbatch";
  inputFilePath: string;
  outputFilePath: string = "batch_coordinates.csv";

  constructor(inputFilePath: string, outputFilePath?: string) {
    this.inputFilePath = inputFilePath;
    if (outputFilePath) this.outputFilePath = outputFilePath;
  }

  _parseFilePath(csvFilePath: string): string | undefined {
    // create absolute directory name for fs methods
    let parsedFilePath: string;
    try {
      parsedFilePath = path.join(import.meta.dirname, csvFilePath);
    } catch (error) {
      throw new Error(`Error parsing file path: ${error}`);
    }

    return parsedFilePath ? parsedFilePath : undefined;
  }

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

  async geocodeBatch(): Promise<void> {
    const formData: FormData | undefined = this._createFormData(
      this.inputFilePath,
    );
    if (!formData)
      throw new Error(`Error creating FormData from ${this.inputFilePath}`);
    const response = await fetch(this.url, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    const resultCsv = await response.text();

    fs.writeFileSync(this.outputFilePath, resultCsv);
    console.log(`Saved to ${this.outputFilePath}`);
  }
}
