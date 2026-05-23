import * as fs from "fs";
import * as path from "path";

class BatchAddressGeocoder {
  url = "https://geocoding.geo.census.gov/geocoder/locations/addressbatch";
  inputFilePath: string;
  outputFilePath: string = "batch_coordinates.csv";

  constructor(inputFilePath: string, outputFilePath?: string) {
    this.inputFilePath = inputFilePath;
    if (outputFilePath) this.outputFilePath = outputFilePath;
  }

  _parseFilePath(csvFilePath: string): string | undefined {
    // create absolute directory name for fs methods
    const _dirname = import.meta.dirname;
    let parsedFilePath: string;
    try {
      parsedFilePath = path.join(_dirname, csvFilePath);
    } catch (error) {
      throw new Error(`Error parsing file path: ${error}`);
    }

    return parsedFilePath ? parsedFilePath : undefined;
  }

  _createFormData(filePath: string): FormData | undefined {
    const fileBuffer = fs.readFileSync(filePath);
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

    const response: Response | undefined = await fetch(this.url, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    const resultCsv = await response.text();

    fs.writeFileSync(outputPath, resultCsv);
    console.log(`Saved to ${outputPath}`);
  }
}

geocodeBatch("5-14-26.csv");
