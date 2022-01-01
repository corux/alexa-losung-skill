import * as program from "commander";
import * as fs from "fs";
import * as https from "https";
import * as path from "path";
import * as process from "process";
import * as unzipper from "unzipper";

program
  .option("--destination <path>", "Schema file to update.")
  .option("--year <year>", "Year to download. If unset, the current, previous and next year will be downloaded.")
  .parse(process.argv);

const destination = program.destination;

if (!fs.existsSync(destination)) {
  fs.mkdirSync(destination);
}

const currentYear = new Date().getFullYear();
const yearsToDownload = program.year ? [parseInt(program.year)] : [currentYear - 1, currentYear, currentYear + 1];

for (let year of yearsToDownload) {
  const url = `https://www.losungen.de/fileadmin/media-losungen/download/Losung_${year}_XML.zip`;
  const destinationFile = path.join(process.cwd(), destination, `${year}.xml`);
  if (fs.existsSync(destinationFile)) {
    console.log(`Losung already exists for ${year}. Skipping download`);
    continue;
  }
  https.get(url, (response) => {
    if (response.statusCode === 200) {
      const file = fs.createWriteStream(destinationFile);
      response.pipe(unzipper.Parse())
        .on("entry", (entry) => {
          if (entry.path.toLowerCase().endsWith(".xml")) {
            entry.pipe(file);
          } else {
            entry.autodrain();
          }
        });
    } else {
      console.error(`Failed to download losungen for ${year} (Status code ${response.statusCode})`);
      if (year === currentYear) {
        process.exit(1);
      }
    }
  });
}
