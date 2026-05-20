import * as fs from "fs";
import * as path from "path";

function parseFilePath(csvFilePath: string): string | undefined {
  const _dirname = import.meta.dirname;
  let parsedFilePath: string;
  try {
    parsedFilePath = path.join(_dirname, csvFilePath);
  } catch (error) {
    throw new Error(`Error parsing file path: ${error}`);
  }

  return parsedFilePath ? parsedFilePath : undefined;
}

function createFormData(filePath: string): FormData | undefined {
  const blob = new Blob([fileBuffer], { type: "text/plain" });
  const formData = new FormData();
  formData.append("addressFile", blob, path.basename(csvFilePath));
  formData.append("benchmark", "Public_AR_Current");
  formData.append("returntype", "location");

  return formData;
}

export default async function geocodeBatch(
  csvFilePath: string,
  outputPath: string = "geocoded_output.csv",
): Promise<void> {
  const fileBuffer = fs.readFileSync(parsedFilePath);

  const url =
    "https://geocoding.geo.census.gov/geocoder/locations/addressbatch";

  const response = await fetch(url, { method: "POST", body: formData });
  if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
  const resultCsv = await response.text();

  fs.writeFileSync(outputPath, resultCsv);
  console.log(`Saved to ${outputPath}`);
}

geocodeBatch("5-14-26.csv");
