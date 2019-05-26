import * as program from "commander";
import * as fs from "fs";
import * as https from "https";
import * as path from "path";
import * as process from "process";
import * as unzipper from "unzipper";

program
  .option("--destination <path>", "Schema file to update.")
  .parse(process.argv);

const destination = program.destination;

if (!fs.existsSync(destination)) {
  fs.mkdirSync(destination);
}

const currentYear = new Date().getFullYear();
for (let i = -1; i <= 1; i++) {
  const year = currentYear + i;
  const url = `https://www.losungen.de/fileadmin/media-losungen/download/Losung_${year}_XML.zip`;
  const destinationFile = path.join(process.cwd(), destination, `${year}.xml`);
  if (fs.existsSync(destinationFile)) {
    console.log(`Losung already exists for ${year}. Skipping download`);
    continue;
  }
  https.get(url, (response) => {
    if (response.statusCode === 200) {
      const file = fs.createWriteStream(destinationFile);
      response.pipe(unzipper.Parse() as any)
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
